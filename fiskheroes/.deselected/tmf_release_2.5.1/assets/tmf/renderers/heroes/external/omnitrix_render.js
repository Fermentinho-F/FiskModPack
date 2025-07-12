function isTransformed(entity) {
    return (entity.getData("tmf:dyn/transformed") & 0x80) == 0;
}

function create(instance, watch, aliens) {
    var externals = [ ];
    var textures = { };
    for (var playlist = 0; playlist < aliens.length; ++playlist) {
        var array = [ ];
        Object.keys(aliens[playlist]).forEach(key => {
            var ext = instance.implement("tmf:external/" + key);
            ext["id"] = key;
            loadExternal(ext, instance, textures);
            array.push(ext);
        });
        externals.push(array);
    }
    
    loadExternal(watch, instance, textures);
    instance.loadTextures(textures);

    var getAlien = entity => {
        var b = entity.getData("tmf:dyn/transformed");
        if ((b & 0x80) != 0) {
            return null;
        }
        return {
            index: b & 15,
            playlist: (b >> 4) & 7,
            ext: externals[(b >> 4) & 7][b & 15]
        };
    };

    var isCurrent = (playlist, index) => {
        return entity => {
            var alien = getAlien(entity);
            return alien != null && alien.playlist == playlist && alien.index == index;
        }
    };

    var getExternal = entity => {
        var alien = getAlien(entity);
        if (alien == null) {
            return watch;
        }
        return alien.ext;
    };

    return {
        init: renderer => {
            renderer.setTexture((entity, renderLayer) => {
                var ext = getExternal(entity);
                return typeof ext !== "undefined" ? ext.getTexture(entity) : "missingno";
            });
            renderer.setLights((entity, renderLayer) => {
                var ext = getExternal(entity);
                return typeof ext !== "undefined" && ext.hasOwnProperty("getLights") ? ext.getLights(entity) : null;
            });

            renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");

            watch = watch.init(renderer, getAlien, entity => !isTransformed(entity));
            externals.forEach((array, playlist) => {
                array.forEach((ext, index) => {
                    externals[playlist][index] = ext.init(renderer, getAlien, isCurrent(playlist, index));
                });
            });
        },
        render: (entity, isFirstPersonArm) => {
            var ext = getExternal(entity);
            if (typeof ext !== "undefined") {
                ext.render(entity, isFirstPersonArm);
            }
        }
    };
}

function loadExternal(ext, instance, textures) {
    if (ext.hasOwnProperty("IMPLEMENTS") && typeof ext.IMPLEMENTS === "object") {
        Object.keys(ext.IMPLEMENTS).forEach(k => {
            ext[k] = instance.implement(ext.IMPLEMENTS[k]);
        });
    }
    if (ext.hasOwnProperty("LOADTEXTURES") && typeof ext.LOADTEXTURES === "object") {
        Object.keys(ext.LOADTEXTURES).forEach(k => {
            textures[k] = ext.LOADTEXTURES[k];
        });
    }
    // Import helper functions normally inherited from fiskheroes:hero_basic
    ext["addAnimation"] = addAnimation;
    ext["addAnimationWithData"] = addAnimationWithData;
    ext["createBadge"] = createBadge;
    ext["pull"] = pull;
}

function addAnimation(renderer, key, anim) {
    if (typeof anim === "string") {
        anim = renderer.createResource("ANIMATION", anim);
    }

    renderer.addCustomAnimation(key, anim);
    return anim;
}

function addAnimationWithData(renderer, key, anim, dataVar) {
    return addAnimation(renderer, key, anim).setData((entity, data) => data.load(entity.getInterpolatedData(dataVar)));
}

function pull(entity, aspect) {
    var color = entity.getWornChestplate().nbt().getInteger('Color');
    var timeout = entity.getData('tmf:dyn/timeout_timer') > 0 && entity.ticksExisted() % 20 == 0;
    var variables = {
        "color": color,
        "timeout": timeout
    }
    return variables[aspect]
}

function createBadge(renderer, x, y, z) {
    var modelBadge = renderer.createResource("MODEL", "tmf:omnitrix/device/badge");
    var badge = renderer.createEffect("fiskheroes:model").setModel(modelBadge);
    badge.setOffset(x, y, z);
    return {
        modelBadge: modelBadge,
        badge: badge,
        render: (color, timeout) => {
            if (timeout) {
                modelBadge.texture.set("omnitrix", "omnitrix_timeout");
            }
            else if (color == 0 || color == 360) {
                modelBadge.texture.set("omnitrix", "omnitrix_white");
            }
            else {
                modelBadge.texture.set("omnitrix", "omnitrix_lights");
            }
            badge.render();
        }
    };
}
