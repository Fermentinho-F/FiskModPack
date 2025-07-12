var LOADTEXTURES = {
	"null": "tmf:null",
	"wildvine": "tmf:omnitrix/p2/aliens/wildvine",
    "wildvine_lights": "tmf:omnitrix/p2/lights/wildvine_lights_base",
    "wildvine_plant": "tmf:omnitrix/p2/aliens/wildvine_plant.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false, false);
    var alienArms = alienModel(renderer, false, true);
    var badge = alienModel(renderer, true, false);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "wildvine.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));

    var modelWildvineArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/wildvine_fp");
    modelWildvineArm.texture.set("wildvine", "wildvine_lights");
    var wildvineArm = renderer.createEffect("fiskheroes:model").setModel(modelWildvineArm);
    wildvineArm.anchor.set("rightArm");

    var modelWildvineThorns = renderer.createResource("MODEL", "tmf:omnitrix/powers/wildvine_thorns");
    modelWildvineThorns.texture.set("wildvine", "wildvine_lights");
    var wildvineThorns = renderer.createEffect("fiskheroes:model").setModel(modelWildvineThorns);
    wildvineThorns.anchor.ignoreAnchor(true);

    var modelWildvinePlant = renderer.createResource("MODEL", "tmf:omnitrix/powers/wildvine_plant");
    modelWildvinePlant.texture.set("wildvine_plant");
    var wildvinePlant = renderer.createEffect("fiskheroes:model").setModel(modelWildvinePlant);
    wildvinePlant.anchor.ignoreAnchor(true);

    var wildvine_Arm = utils.createModel(renderer, "tmf:omnitrix/powers/wildvine_arm", "wildvine");
    var wildvineClaw = utils.createModel(renderer, "tmf:omnitrix/powers/wildvine_claw", "wildvine");
    wildvineClaw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var wildvineTentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [-2.5, 1.5, -0.1], "direction": [-5.0, -3.0, -5.0] },
        { "offset": [2.5, 1.5, -0.1], "direction": [5.0, -3.0, -5.0] }
    ]);
    wildvineTentacles.anchor.ignoreAnchor(true);
    wildvineTentacles.setSegmentModel(wildvine_Arm);
    wildvineTentacles.setHeadModel(wildvineClaw);
    wildvineTentacles.segmentLength = 8;
    wildvineTentacles.segments = 1;
    wildvineTentacles.setCondition(entity => isCurrent(entity));

    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                if (entity.getData('tmf:dyn/pt_1') != 1) {
                    alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pt_1'), 0);
                    badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pt_1'), 0);
                    if (entity.getInterpolatedData('fiskheroes:tentacle_extend_timer') != 1) {
                        alienArms.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pt_1'), 1-entity.getInterpolatedData('fiskheroes:tentacle_extend_timer'));
                    }
                    if (entity.getInterpolatedData('fiskheroes:beam_charge') != 0 && entity.getData('tmf:dyn/pt_1') == 0) {
                        wildvineThorns.setScale(entity.getInterpolatedData('fiskheroes:beam_charge'), 0.6+0.4*entity.getInterpolatedData('fiskheroes:beam_charge'), entity.getInterpolatedData('fiskheroes:beam_charge'));
                        wildvineThorns.render();
                    }
                }
                if (entity.getData('tmf:dyn/pt_1') == 1) {
                    wildvinePlant.setOffset(0, 10-38*entity.getInterpolatedData('tmf:dyn/pt_3'), 0);
                    wildvinePlant.setScale(0.001+ 2.3*entity.getInterpolatedData('tmf:dyn/pt_1'));
                    wildvinePlant.render();
                }
            }
            if (isFirstPersonArm && entity.getData('fiskheroes:tentacle_extend_timer') == 0) {
                wildvineArm.render();
            }
        }
    };
}

function alienModel(renderer, badge, arms) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_wildvine" : arms ? "tmf:omnitrix/aliens/wildvine_arms" : "tmf:omnitrix/aliens/wildvine");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/wildvine").setData((entity, data) => {
        data.load(0, entity.loop(68));
        data.load(1, entity.getPunchTimerInterpolated());
        data.load(2, entity.motionInterpolated().y());
        data.load(3, entity.getInterpolatedData('tmf:dyn/pt_1'));
    });
    modelAlien.texture.set("wildvine", "wildvine_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);	
    alien.setScale(0.7);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, timer, timer2) => {
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
            if (arms) {
                alien.setScale(0.7*timer2);
            }
            alien.setOffset(0, 7+14*timer, 0);	
            alien.render();
        }
    };
}