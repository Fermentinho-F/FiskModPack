var LOADTEXTURES = {
    "null": "tmf:null",
    "stinkarms": "tmf:omnitrix/p1/aliens/stinkarms",
    "stinkarms_lights": "tmf:omnitrix/p1/lights/stinkarms_lights_base"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));

    var modelStinkarmsFp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/fourarms_fp");
    modelStinkarmsFp.bindAnimation("tmf:omnitrix/aliens/fourarms2").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(1, entity.getInterpolatedData('tmf:dyn/pc_2'));
        data.load(2, entity.getInterpolatedData('tmf:dyn/pt_3'));
        data.load(3, entity.getInterpolatedData('tmf:dyn/pc_3'));
        data.load(4, entity.isSneaking() ? 1 : 0);
        data.load(5, entity.loop(84));
        data.load(6, entity.getData('fiskheroes:beam_charging') && entity.getData('fiskheroes:beam_shooting_timer') == 0 ? entity.getInterpolatedData('fiskheroes:beam_charge') : 0);
        data.load(7, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
    });
    modelStinkarmsFp.texture.set("fourarms", "fourarms_lights");
    var stinkarmsFp = renderer.createEffect("fiskheroes:model").setModel(modelStinkarmsFp);
    stinkarmsFp.setRotation(-25, 0, 0);
    stinkarmsFp.setOffset(0, 6, 7);
    stinkarmsFp.setScale(0.75);
    stinkarmsFp.anchor.ignoreAnchor(true);

    addAnimation(renderer, "stinkarms.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

        //SICK

    return {
        getTexture: entity => "null",
        getLights: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (isFirstPersonArm) {
                stinkarmsFp.render();
            }
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_stinkarms" : "tmf:omnitrix/aliens/stinkarms");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/stinkarms").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(1, entity.getInterpolatedData('tmf:dyn/pc_2'));
        data.load(2, entity.getInterpolatedData('tmf:dyn/pt_3'));
        data.load(3, entity.getInterpolatedData('tmf:dyn/pc_3'));
        data.load(4, entity.isSneaking() ? 1-entity.getInterpolatedData('fiskheroes:heat_vision_timer') : 0);
        data.load(5, entity.loop(84));
        data.load(6, entity.getData('fiskheroes:beam_charging') && entity.getData('fiskheroes:beam_shooting_timer') == 0 ? entity.getInterpolatedData('fiskheroes:beam_charge') : 0);
        data.load(7, entity.getInterpolatedData('fiskheroes:beam_shooting_timer'));
        data.load(8, entity.getInterpolatedData('fiskheroes:heat_vision_timer'));
        data.load(9, entity.getInterpolatedData('tmf:dyn/pc_4'));
        data.load(10, entity.getInterpolatedData('fiskheroes:flight_timer'));
        data.load(11, entity.loop(3));
    });
    modelAlien.texture.set("stinkarms", "stinkarms_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(0.9);
    alien.setOffset(0,0,0);

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