var LOADTEXTURES = {
	"null": "tmf:null",
	"snare_oh": "tmf:omnitrix/p2/aliens/snare_oh.tx.json",
    "snare_oh_lights": "tmf:omnitrix/p2/lights/snare_oh_lights.tx.json",
    "snare_oh_bandage1": "tmf:omnitrix/p2/aliens/snare_oh_bandage1"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));
    
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "snare_oh.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

    var modelSnareOhArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/snare_oh_arm");
    modelSnareOhArm.texture.set("snare_oh", "snare_oh_lights");
    var snareOhArm = renderer.createEffect("fiskheroes:model").setModel(modelSnareOhArm);
    snareOhArm.anchor.set("rightArm");

    var modelSnareOhBandages1 = renderer.createResource("MODEL", "tmf:omnitrix/powers/fourarms_spin");
    modelSnareOhBandages1.bindAnimation("tmf:omnitrix/powers/fourarms_spin").setData((entity, data) => {
        data.load(1, entity.loop(20) * entity.getInterpolatedData('tmf:dyn/pt_1'));
    });
    modelSnareOhBandages1.texture.set("snare_oh_bandage1");
    var snareOhBandages1 = renderer.createEffect("fiskheroes:model").setModel(modelSnareOhBandages1);
    snareOhBandages1.anchor.ignoreAnchor(true);

    var snareOhTentacleArm = utils.createModel(renderer, "tmf:omnitrix/powers/snare_oh_arm", "snare_oh", "null");
    var snareOhTentacleClaw = utils.createModel(renderer, "tmf:omnitrix/powers/snare_oh_claw", "snare_oh", "null");
    var tentaclesSnareOh = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.0, -3, -1], "direction": [5.0, 3.0, -13.0] },
        { "offset": [-2.0, -3, -1], "direction": [-5.0, 3.5, -12.0] },
        { "offset": [-0.5, -7, -1], "direction": [5.0, -3.0, -21.0] },
    ]);
    tentaclesSnareOh.anchor.set("body");
    tentaclesSnareOh.setSegmentModel(snareOhTentacleArm);
    tentaclesSnareOh.setHeadModel(snareOhTentacleClaw);
    tentaclesSnareOh.segmentLength = 4.8;
    tentaclesSnareOh.segments = 9;
    tentaclesSnareOh.setCondition(entity => isCurrent(entity));

    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            if (entity.getData('tmf:dyn/pt_1') != 1) {  
                if (isFirstPersonArm) {
                    snareOhArm.setScale(0.75*(1-entity.getInterpolatedData('tmf:dyn/pt_1')));
                    snareOhArm.render();
                }
                if (!isFirstPersonArm) {
                    alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pt_1'));
                    badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pt_1'));
                    
                }
            }
            if (entity.getData('tmf:dyn/pt_1') != 0) { 
                //if (entity.getData('tmf:dyn/pt_1') != 1) {     
                    snareOhBandages1.setScale(2*entity.getInterpolatedData('tmf:dyn/pt_1'));
                    snareOhBandages1.setOffset(0, 16-10*entity.getInterpolatedData('tmf:dyn/pt_1'), 0);	
                    snareOhBandages1.render();
                //}
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_snare_oh" : "tmf:omnitrix/aliens/snare_oh");
    modelAlien.texture.set("snare_oh", "snare_oh_lights");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/snare_oh").setData((entity, data) => {
        data.load(0, entity.loop(64));
        data.load(1, entity.getPunchTimerInterpolated());
        data.load(2, entity.isSneaking() ? 1 : 0);
        data.load(3, entity.motionInterpolated().y());
        data.load(4, entity.getInterpolatedData('fiskheroes:beam_charge'));
        data.load(5, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
        data.load(6, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(7, entity.loop(28));
        data.load(8, entity.getInterpolatedData('fiskheroes:tentacle_extend_timer'));
        data.load(9, entity.getInterpolatedData('fiskheroes:tentacle_lift'));
    });
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setOffset(0, 6, 0);
    alien.setScale(0.75);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, timer) => {
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

            alien.opacity = Math.min(2-2*timer, 1);
            alien.render();
        }
    };
}