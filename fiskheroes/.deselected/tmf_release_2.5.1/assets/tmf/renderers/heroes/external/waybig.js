var LOADTEXTURES = {
    "null": "tmf:null",
    "waybig": "tmf:omnitrix/p2/aliens/waybig",
    "waybig_lights": "tmf:omnitrix/p2/lights/waybig",
    "waybig_shockwave": "tmf:omnitrix/p2/aliens/waybig_shockwave",
    "waybig_beam": "tmf:omnitrix/p2/lights/waybig_beam.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);
    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));

    var model_waybigArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/waybig_arm");
    model_waybigArm.texture.set("waybig");
    var waybigArm = renderer.createEffect("fiskheroes:model").setModel(model_waybigArm);
    waybigArm.anchor.set("rightArm");
    waybigArm.setOffset(0, -8, 0);
    waybigArm.setScale(0.5);

    var model_waybigShockwave = renderer.createResource("MODEL", "tmf:omnitrix/powers/waybig_shockwave");
    model_waybigShockwave.texture.set("waybig_shockwave");
    var waybigShockwave = renderer.createEffect("fiskheroes:model").setModel(model_waybigShockwave);
    waybigShockwave.setOffset(0, 15.7, 0);
    waybigShockwave.anchor.ignoreAnchor(true);

    var model_waybigBeam = renderer.createResource("MODEL", "tmf:omnitrix/powers/waybig_beam");
    model_waybigBeam.texture.set(null, "waybig_beam");
    var waybigBeam = renderer.createEffect("fiskheroes:model").setModel(model_waybigBeam);
    waybigBeam.setOffset(0, 15.7, 0);
    waybigBeam.anchor.ignoreAnchor(true);
    waybigBeam.setScale(0.35);

    var explosionShakeWaybig = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        explosionShakeWaybig.factor = 0.5;
        return isCurrent(entity) && entity.getData("fiskheroes:heat_vision");
        });

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "head", 0xF3985B, [
    ]).setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "body", 0xedda70, [
        { "offset": [0.0, 1.5, -9.0], "size": [2.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_Lexplosion")).setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "waybig.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
    }).setCondition(entity => isCurrent(entity));

    return {
        getTexture: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (isFirstPersonArm) {
                waybigArm.render();
            }
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));

                if (entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0) {
                    waybigShockwave.setScale(5*entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"), 0.35, 5*entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"));
                    waybigShockwave.render();
                }

                if (entity.getData("fiskheroes:beam_charge") > 0) {
                    waybigBeam.render();
                }
            }
        }
    };
}

function alienModel(renderer, badge) {        
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_waybig" : "tmf:omnitrix/aliens/waybig");
    modelAlien.texture.set("waybig", "waybig_lights");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/waybig").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(128));
        data.load(3, entity.getData("fiskheroes:scale"));
        data.load(4, entity.getData("tmf:dyn/p_1") ? entity.getInterpolatedData("tmf:dyn/pt_1") : 0);
        data.load(5, !entity.getData("tmf:dyn/p_1") ? entity.getInterpolatedData("tmf:dyn/pc_1") : 0);
        data.load(6, entity.getInterpolatedData("fiskheroes:dyn/superhero_landing_timer"));
        data.load(7, entity.getInterpolatedData("tmf:dyn/pt_3"));
        data.load(8, entity.getInterpolatedData("fiskheroes:beam_charge"));
    });
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setOffset(0, 15.7, 0);
    alien.setScale(0.35);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout) => {
            if (badge) {
                if (timeout) {
                    modelAlien.texture.set("omnitrixB", "omnitrixB_timeout");
                }
                else if (color == 0 || color == 360) {
                    modelAlien.texture.set("omnitrixB", "omnitrixB_white");
                }
                else {
                    modelAlien.texture.set("omnitrixB", "omnitrixB_lights");
                }
            }
            alien.render();
        }
    };
}