var LOADTEXTURES = {
    "null": "tmf:null",
    "fourarms": "tmf:omnitrix/p1/aliens/fourarms",
    "fourarms_sick": "tmf:omnitrix/p1/aliens/fourarms_sick",
    "fourarms_lights": "tmf:omnitrix/p1/lights/fourarms_lights",
    "fourarms_spin": "tmf:omnitrix/p1/aliens/fourarms_spin"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false, false);
    var alienSick = alienModel(renderer, false, true);
    var badge = alienModel(renderer, true, false);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));
    
    addAnimation(renderer, "fourarms.CRAWL", "tmf:omnitrix/powers/fourarms_crawl").setData((entity, data) => {
        data.load(0, wrapAngleTo180(entity.rotBodyYawInterpolated()));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(2, entity.getInterpolatedData("tmf:dyn/pc_6"));
    }).setCondition(entity => isCurrent(entity));

    var model_FourarmsFP = renderer.createResource("MODEL", "tmf:omnitrix/aliens/fourarms_fp");
    model_FourarmsFP.bindAnimation("tmf:omnitrix/aliens/fourarms2").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(1, entity.getInterpolatedData('tmf:dyn/pc_2'));
        data.load(2, entity.getInterpolatedData('tmf:dyn/pt_3'));
        data.load(3, entity.getInterpolatedData('tmf:dyn/pc_3'));
        data.load(4, entity.isSneaking() ? 1 : 0);
        data.load(5, entity.loop(84));
        data.load(6, entity.getData('fiskheroes:beam_charging') && entity.getData('fiskheroes:beam_shooting_timer') == 0 ? entity.getInterpolatedData('fiskheroes:beam_charge') : 0);
        data.load(7, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
    });
    model_FourarmsFP.texture.set("fourarms", "fourarms_lights");
    var fourarmsFp = renderer.createEffect("fiskheroes:model").setModel(model_FourarmsFP);
    fourarmsFp.setRotation(-75, 0, 0);
    fourarmsFp.setOffset(0, 4, 2);
    fourarmsFp.setScale(0.75);
    fourarmsFp.anchor.ignoreAnchor(true);

    var model_FASpin = renderer.createResource("MODEL", "tmf:omnitrix/powers/fourarms_spin");
    model_FASpin.bindAnimation("tmf:omnitrix/powers/fourarms_spin").setData((entity, data) => {
        data.load(1, entity.getData('fiskheroes:heat_vision') ? entity.loop(20) * entity.getInterpolatedData('fiskheroes:heat_vision_timer') : 0);
    });
    model_FASpin.texture.set("fourarms_spin");
    var fourarmsSpin = renderer.createEffect("fiskheroes:model").setModel(model_FASpin);
    fourarmsSpin.anchor.ignoreAnchor(true);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmf:thunder_clap", "body", 0xCACBCB, [
        { "firstPerson": [0, 0, -20.0], "offset": [0.0, 0.0, -20.0], "size": [10.0, 10.0, 10.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmf:impact_Lexplosion")).setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:thunder_clap", "body", 0xCACBCB, [
    ]).setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "fourarms.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
    addAnimation(renderer, "fourarms.SPIN", "tmf:omnitrix/powers/spin").setData((entity, data) => {
        data.load(9, entity.getData('fiskheroes:heat_vision') ? entity.loop(8) * entity.getInterpolatedData('fiskheroes:heat_vision_timer') : 0);
        }).setCondition(entity => isCurrent(entity));

    var shakeFourArms1 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakeFourArms1.factor = 0.15 * entity.getInterpolatedData("fiskheroes:heat_vision_timer");
        return isCurrent(entity);
        });

    var shakeFourArms2 = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shakeFourArms2.factor = 0.3 * entity.getInterpolatedData("fiskheroes:beam_shooting_timer");
        return isCurrent(entity);
        });

        //SICK
    
        var model_FourarmsFPSick = renderer.createResource("MODEL", "tmf:omnitrix/aliens/fourarms_fp");
        model_FourarmsFPSick.bindAnimation("tmf:omnitrix/aliens/fourarms2").setData((entity, data) => {
            data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
            data.load(1, entity.getInterpolatedData('tmf:dyn/pc_2'));
            data.load(2, entity.getInterpolatedData('tmf:dyn/pt_3'));
            data.load(3, entity.getInterpolatedData('tmf:dyn/pc_3'));
            data.load(4, entity.isSneaking() ? 1 : 0);
            data.load(5, entity.loop(84));
            data.load(6, entity.getData('fiskheroes:beam_charging') && entity.getData('fiskheroes:beam_shooting_timer') == 0 ? entity.getInterpolatedData('fiskheroes:beam_charge') : 0);
            data.load(7, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
        });
        model_FourarmsFPSick.texture.set("fourarms_sick", "fourarms_lights");
        var fourarmsFpSick = renderer.createEffect("fiskheroes:model").setModel(model_FourarmsFPSick);
        fourarmsFpSick.setRotation(-75, 0, 0);
        fourarmsFpSick.setOffset(0, 4, 2);
        fourarmsFpSick.setScale(0.75);
        fourarmsFpSick.anchor.ignoreAnchor(true);
    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (isFirstPersonArm) {
                fourarmsFp.render();
                fourarmsFpSick.opacity = entity.getInterpolatedData('tmf:dyn/pc_5');
                fourarmsFpSick.render();
            }
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pc_5'));
                alienSick.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pc_5'));
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getInterpolatedData('tmf:dyn/pc_5'));
            }
            if (entity.getData('fiskheroes:heat_vision')) {
                fourarmsSpin.opacity = 0.6*entity.getInterpolatedData('fiskheroes:heat_vision_timer');
                fourarmsSpin.render();
            }
        }
    };
}

function alienModel(renderer, badge, sick) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_fourarms" : "tmf:omnitrix/aliens/fourarms");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/fourarms").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(1, entity.getInterpolatedData('tmf:dyn/pc_2'));
        data.load(2, entity.getInterpolatedData('tmf:dyn/pt_3'));
        data.load(3, entity.getInterpolatedData('tmf:dyn/pc_3'));
        data.load(4, entity.isSneaking() ? 1-entity.getInterpolatedData('fiskheroes:heat_vision_timer') : 0);
        data.load(5, entity.loop(84));
        data.load(6, entity.getData('fiskheroes:beam_charging') && entity.getData('fiskheroes:beam_shooting_timer') == 0 ? entity.getInterpolatedData('fiskheroes:beam_charge') : 0);
        data.load(7, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
        data.load(8, entity.getInterpolatedData('fiskheroes:heat_vision_timer'));
        data.load(9, entity.getInterpolatedData('tmf:dyn/pc_7'));
        data.load(10, entity.getInterpolatedData('fiskheroes:flight_timer'));
    });
    modelAlien.texture.set("fourarms", "fourarms_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(0.7);
    alien.setOffset(0,7,0);

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
                modelAlien.texture.set("fourarms_sick", "fourarms_lights");
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