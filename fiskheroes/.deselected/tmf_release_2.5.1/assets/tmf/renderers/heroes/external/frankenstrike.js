var LOADTEXTURES = {
	"null": "tmf:null",
	"frankenstrike": "tmf:omnitrix/p2/aliens/frankenstrike",
    "frankenstrike_lights": "tmf:omnitrix/p2/lights/frankenstrike_lights.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "frankenstrike.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

    var modelFrankenstrikeFp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/frankenstrike_fp");
    modelFrankenstrikeFp.texture.set("frankenstrike", "frankenstrike_lights");
    var frankenstrikeFp = renderer.createEffect("fiskheroes:model").setModel(modelFrankenstrikeFp);
    frankenstrikeFp.anchor.set("rightArm");
    frankenstrikeFp.setOffset(0, 5, 0);

    var frankenstrike_lightning = renderer.createResource("BEAM_RENDERER", "tmf:frankenstrike_lightning");
	
    var frankenstrikeLightning = utils.createLines(renderer, frankenstrike_lightning, 0x6e8f48, [
        {"start": [3.5, -3, 3], "end": [3.5, 0, -1], "size": [5.0, 5.0]},
        {"start": [-3.5, -3, 3], "end": [-3.5, 0, -1], "size": [5.0, 5.0]}
    ]);
    frankenstrikeLightning.anchor.set("body");
    frankenstrikeLightning.setOffset(0.0, -7.0, 8.0);

    var beam1 = utils.bindBeam(renderer, "fiskheroes:lightning_cast", "tmf:frankenstrike_lightning", "body", 0x6e8f48, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-8, 9.0, 0.0], "size": [1.0, 1.0] }
    ]).setCondition(entity =>  {
        if (isCurrent(entity) && entity.getData("tmf:dyn/upgrade") == null) {
            beam1.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            return true;
        }
        return false;
    });
    var beam2 = utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:frankenstrike_lightning", "body", 0x6e8f48, [
        { "firstPerson": [0.0, -10.0, 0.0], "offset": [0.0, -7.0, 5.0], "size": [1.0, 1.0] }
    ]).setCondition(entity =>  {
        if (isCurrent(entity) && entity.getData("tmf:dyn/upgrade") == null) {
            beam2.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            return true;
        }
        return false;
    });

    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            if (isFirstPersonArm) {
                frankenstrikeFp.render();  
            }
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));

                frankenstrikeLightning.progress = entity.getInterpolatedData("fiskheroes:beam_charge");
                frankenstrikeLightning.color.setHSB(((88 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.5, 0.56);
                frankenstrikeLightning.render();
            }
            
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_frankenstrike" : "tmf:omnitrix/aliens/frankenstrike");
    modelAlien.texture.set("frankenstrike", "frankenstrike_lights");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/frankenstrike").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(48));
    });
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setOffset(0, 6, 0);
    alien.setScale(0.75);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout) => {
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
            alien.render();
        }
    };
}