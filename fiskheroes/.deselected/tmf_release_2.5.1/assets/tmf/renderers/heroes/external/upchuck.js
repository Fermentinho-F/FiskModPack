var LOADTEXTURES = {
	"null": "tmf:null",
	"upchuck": "tmf:omnitrix/p2/aliens/upchuck.tx.json",
    "upchuck_lights": "tmf:omnitrix/p2/lights/upchuck_lights",
    "upchuck_lights_overlay": "tmf:omnitrix/p2/lights/upchuck_lights_overlay.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false, false, false);
    var alienTongue = alienModel(renderer, false, true, false);
    var alienOverlay = alienModel(renderer, false, false, true);
    var badge = alienModel(renderer, true, false, false, false);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "upchuck.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", null, "body", null, []).setCondition(entity => isCurrent(entity));

    var beam1 = utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "tmf:upgrade_beam", "head", 0xbaf43c, [
        { "firstPerson": [0, 3.75, -4.0], "offset": [0, 0, -16.0], "size": [4.5, 4.5] }
    ]).setCondition(entity =>  {
        if (isCurrent(entity) && entity.getData("tmf:dyn/pt_3") == 1) {
            beam1.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            return true;
        }
        return false;
    });

    var beam2 = utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "tmf:upgrade_beam", "head", 0xbaf43c, [
        { "firstPerson": [0, 3.75, -4.0], "offset": [0, 0, -16.0], "size": [1.5, 1.5] }
    ]).setCondition(entity =>  {
        if (isCurrent(entity) && entity.getData("tmf:dyn/pt_3") == 2) {
            beam2.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            return true;
        }
        return false;
    });

    var upchuck_bomb = renderer.createResource("BEAM_RENDERER", "tmf:upgrade_beam");
	
    var upchuckBomb = utils.createLines(renderer, upchuck_bomb, 0xbaf43c, [
        {"start": [0, 0, 0], "end": [0, 1, 0], "size": [32.0, 32.0]}
    ]);
    upchuckBomb.anchor.set("body");

    var modelUpchuckFp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/upchuck_arm");
    modelUpchuckFp.texture.set("upchuck", "null");
    var upchuckFp = renderer.createEffect("fiskheroes:model").setModel(modelUpchuckFp);
    upchuckFp.anchor.set("rightArm");
    upchuckFp.setOffset(0, 5, 0);

    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            var PT1 = entity.getInterpolatedData("tmf:dyn/pt_1");
            var PC1 = entity.getInterpolatedData("tmf:dyn/pc_1");

            if (isFirstPersonArm) {
                upchuckFp.render();  
            }
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.isSneaking(), PC1, 0, false);
                alienOverlay.render(pull(entity, "color"), pull(entity, "timeout"), entity.isSneaking(), PC1, entity.loop(64), false);
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.isSneaking(), PC1, 0, false);
            }
            alienTongue.render(pull(entity, "color"), pull(entity, "timeout"), entity.isSneaking(), PT1, 0, isFirstPersonArm);

            upchuckBomb.progress = Math.max(5*entity.getInterpolatedData("tmf:dyn/pt_2")-4,0);
            upchuckBomb.setScale(Math.max(10*entity.getInterpolatedData("tmf:dyn/pc_1")*(100*entity.getInterpolatedData("tmf:dyn/pt_2")-60),0))
            upchuckBomb.color.setHSB(((78.9 + entity.getWornChestplate().nbt().getInteger('Color')) % 360) / 360, 0.893, 0.596);
            upchuckBomb.render();
        }
    };
}

function alienModel(renderer, badge, tongue, overlay) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_upchuck" : tongue ? "tmf:omnitrix/powers/upchuck_tongues" : "tmf:omnitrix/aliens/upchuck");
    modelAlien.texture.set("upchuck", "upchuck_lights");
    modelAlien.bindAnimation(tongue ? "tmf:omnitrix/aliens/upchuck_tongue" :"tmf:omnitrix/aliens/upchuck").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(48));
        data.load(3, entity.getInterpolatedData("tmf:dyn/pt_1"));
        data.load(4, entity.loop(12));
        data.load(5, entity.getInterpolatedData("tmf:dyn/pt_2"));
    });
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(1.9);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, sneaking, timer, loop, FP) => {
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
            if (overlay) {
                modelAlien.texture.set(null , "upchuck_lights_overlay");
                alien.opacity = timer*0.3 + 0.2*timer*Math.sin(2*Math.PI*loop);
            }
            if (!tongue) {
                alien.setOffset(0, -22-(sneaking ? 4 : 0) ,0);
            }
            if (tongue) {
                if (timer != 0) {
                    alien.setScale(1.9*timer, 1.9, 1.9*timer);
                    alien.render();
                }
                if (!FP) {
                    alien.setOffset(0, -22-(sneaking ? 2 : 0) ,0);
                }
                else {
                    alien.setOffset(0, -10 ,12);
                }
            }
            else {
                alien.render();
            }
        }
    };
}