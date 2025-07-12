var LOADTEXTURES = {
    "null": "tmf:null",
    "ghostfreak": "tmf:omnitrix/p1/aliens/ghostfreak.tx.json",
    "ghostfreak_lights": "tmf:omnitrix/p1/lights/ghostfreak_lights_base",
    "ghostfreak_tentacles": "tmf:omnitrix/p1/aliens/ghostfreak_tentacles",
    "ghostfreak_body": "tmf:omnitrix/p1/aliens/ghostfreak_body"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));
    
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:thunder_clap", "body", 0xCACBCB, [
    ]).setCondition(entity => isCurrent(entity));

    var modelGhostfreakArm = renderer.createResource("MODEL", "tmf:omnitrix/powers/ghostfreak_rArm");
    modelGhostfreakArm.texture.set("ghostfreak", "ghostfreak_lights");
    var ghostfreakArm = renderer.createEffect("fiskheroes:model").setModel(modelGhostfreakArm);
    ghostfreakArm.anchor.set("rightArm");

    var modelGhostfreakTentacles = renderer.createResource("MODEL", "tmf:omnitrix/powers/ghostfreak_tentacles");
    modelGhostfreakTentacles.bindAnimation("tmf:omnitrix/powers/ghostfreak_tentacles").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(60));
    });
    modelGhostfreakTentacles.texture.set("ghostfreak_tentacles");
    var ghostfreakTentacles = renderer.createEffect("fiskheroes:model").setModel(modelGhostfreakTentacles);
    ghostfreakTentacles.anchor.ignoreAnchor(true);

    var modelGhostfreakBody = renderer.createResource("MODEL", "tmf:omnitrix/powers/ghostfreak_body");
    modelGhostfreakBody.texture.set("ghostfreak_body");
    var ghostfreakBody = renderer.createEffect("fiskheroes:model").setModel(modelGhostfreakBody);
    ghostfreakBody.anchor.ignoreAnchor(true);

    var ghostfreakNightVision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => {
        ghostfreakNightVision.factor = 1.0;
        ghostfreakNightVision.firstPersonOnly = false;
        return isCurrent(entity);
    });

    addAnimation(renderer, "ghostfreak.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
  

    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getData('fiskheroes:intangible'));
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getData('fiskheroes:intangible'));
            }
            if (isFirstPersonArm) {
                ghostfreakArm.opacity = entity.getData('fiskheroes:intangible') ? 0.6 : 1;
                ghostfreakArm.render();
            }
            if ((entity.getData('fiskheroes:beam_charge') + entity.getData('tmf:dyn/pt_1') + entity.getData('tmf:dyn/pc_1')) != 0) {
                ghostfreakTentacles.setScale(0.2+0.8*entity.getInterpolatedData('tmf:dyn/pc_1'), 0.2+0.8*entity.getInterpolatedData('tmf:dyn/pc_1') ,entity.getInterpolatedData('tmf:dyn/pc_1'));
                ghostfreakTentacles.setOffset(0, 6*(1-entity.getInterpolatedData('tmf:dyn/pc_1')),0);
                ghostfreakTentacles.render();
                ghostfreakBody.setScale(entity.getInterpolatedData('fiskheroes:beam_charge'), 1, entity.getInterpolatedData('fiskheroes:beam_charge'));
                ghostfreakBody.render();
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_ghostfreak" : "tmf:omnitrix/aliens/ghostfreak");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/ghostfreak").setData((entity, data) => {
        data.load(0, entity.isSneaking() ? 1 : 0);
        data.load(1, entity.loop(60));
        data.load(2, entity.loop(80));
        data.load(3, entity.getPunchTimerInterpolated());
        data.load(4, entity.getInterpolatedData('fiskheroes:beam_charge'));
    });
    modelAlien.texture.set("ghostfreak", "ghostfreak_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);	
    alien.setOffset(0,2,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, opacity) => {
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
            alien.opacity = opacity ? 0.6 : 1;
            alien.render();
        }
    };
}