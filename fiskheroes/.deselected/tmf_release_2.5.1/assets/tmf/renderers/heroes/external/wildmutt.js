var LOADTEXTURES = {
    "null": "tmf:null",
    "wildmutt": "tmf:omnitrix/p1/aliens/wildmutt",
    "wildmutt_sick": "tmf:omnitrix/p1/aliens/wildmutt_sick"

};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));

    var alien = alienModel(renderer, false, false);
    var alienSick = alienModel(renderer, false, true);
    var badge = alienModel(renderer, true, false);

    var wildmuttNightVision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        wildmuttNightVision.factor = 0.5;
        wildmuttNightVision.firstPersonOnly = false;
        return isCurrent(entity);
    });

    var forcefieldWildmutt = renderer.bindProperty("fiskheroes:forcefield");
    forcefieldWildmutt.color.set(0xBF7167);
    forcefieldWildmutt.setShape(20, 10).setOffset(0.0, 6.0, 0.0);
    forcefieldWildmutt.setCondition(entity => isCurrent(entity));

    var forcefieldWildmutt2 = renderer.bindProperty("fiskheroes:forcefield");
    forcefieldWildmutt2.color.set(0x8DA76F);
    forcefieldWildmutt2.setShape(17, 7).setOffset(0.0, 6.0, 0.0).setScale(16);
    forcefieldWildmutt2.setCondition(entity => isCurrent(entity));

    var forcefieldWildmutt3 = renderer.bindProperty("fiskheroes:forcefield");
    forcefieldWildmutt3.color.set(0x8DA76F);
    forcefieldWildmutt3.setShape(17, 7).setOffset(0.0, 6.0, 0.0);
    forcefieldWildmutt3.setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "wildmutt.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
    }).setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "wildmutt.CRAWL", "tmf:omnitrix/powers/wildmutt_crawl").setData((entity, data) => {
        data.load(0, wrapAngleTo180(entity.rotBodyYawInterpolated()));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(2, entity.getInterpolatedData("tmf:dyn/pc_3"));
    }).setCondition(entity => isCurrent(entity));

    return {
        getTexture: entity => "null",
        render: (entity, isFirstPersonArm) => {
                var PC1 = entity.getInterpolatedData('tmf:dyn/pc_1');
            
                if (!isFirstPersonArm) {
                    alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pc_5'));
                    alienSick.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pc_5'));
                    badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pc_5'));
                    

                    forcefieldWildmutt.opacity = 0;
                    forcefieldWildmutt2.opacity = 0;
                    forcefieldWildmutt3.opacity = 0;
                    }
                if (isFirstPersonArm) {
                    forcefieldWildmutt.opacity = 0.5+0.2*Math.sin(Math.PI*entity.loop(20)) - 0.2*PC1;
                    forcefieldWildmutt2.opacity = 0.7 - 0.6*PC1 + 0.3*Math.sin(Math.PI*entity.loop(20));
                    forcefieldWildmutt3.opacity = 0.4*(1-entity.loop(84));
                    forcefieldWildmutt3.setScale(32*entity.loop(84));
                }

        }
    };
}

function alienModel(renderer, badge, sick) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_wildmutt" : "tmf:omnitrix/aliens/wildmutt");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/wildmutt").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(1, entity.loop(60));
        data.load(2, entity.getData('tmf:dyn/p_1') ? entity.getInterpolatedData('tmf:dyn/pc_1') : 0);
        data.load(3, entity.loop(40));
        data.load(4, entity.getPunchTimerInterpolated());
        data.load(5, entity.getInterpolatedData("tmf:dyn/pc_4"));
        data.load(6, entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
    modelAlien.texture.set("wildmutt");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(1.7);
    alien.setOffset(0,-14,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, sickTimer) => {
            if (badge) {
                if (timeout) {
                    modelAlien.texture.set("omnitrix", "omnitrix_timeout");
                }
                else if (color == 0 || color == 360) {
                    modelAlien.texture.set("omnitrix", "omnitrix_white");
                }
                else {
                    modelAlien.texture.set("omnitrix", "omnitrix_lights");
                }
            }
            if (!badge && sick) {
                modelAlien.texture.set("wildmutt_sick");
                alien.opacity = sickTimer;
            }
            alien.render();
        }
    };
}

function wrapAngleTo180(value) {
    value %= 360;
    if (value >= 180) {
        value -= 360;
    }
    if (value < -180) {
        value += 360;
    }
    return value;
}