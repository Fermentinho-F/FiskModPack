var LOADTEXTURES = {
    "null": "tmf:null",
    "ditto": "tmf:omnitrix/p2/aliens/ditto",
    "ditto_lights": "tmf:omnitrix/p2/lights/ditto_lights.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p2").setCondition(entity => isCurrent(entity));
    
    var model_DittoArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/ditto_arm");
    model_DittoArm.texture.set("ditto", "ditto_lights");
    var dittoArm = renderer.createEffect("fiskheroes:model").setModel(model_DittoArm);
    dittoArm.anchor.set("rightArm");

    addAnimation(renderer, "ditto.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
  
    utils.bindBeam(renderer, "fiskheroes:heat_vision", null, "body", null, []).setCondition(entity => isCurrent(entity));
    return {
        getTexture: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
            }
            if (isFirstPersonArm) {
                dittoArm.render();
            }
        }
    };
}

function alienModel(renderer, badge) {        
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_ditto" : "tmf:omnitrix/aliens/ditto");
    modelAlien.texture.set("ditto", "ditto_lights");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/ditto").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(48));
        data.load(3, entity.getInterpolatedData("tmf:dyn/pt_1"));
        data.load(4, entity.getInterpolatedData("tmf:dyn/pc_1"));
        data.load(5, entity.getInterpolatedData("tmf:dyn/pt_3"));
        data.load(6, entity.getInterpolatedData("tmf:dyn/pc_3"));
        data.load(7, entity.getInterpolatedData("tmf:dyn/pt_4"));
        data.load(8, entity.getInterpolatedData("tmf:dyn/pc_4"));

        var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
        data.load(9, f > 0 ? Math.min((1 - f) * 2.5, 1) : 0);
        data.load(10, entity.getInterpolatedData("tmf:dyn/pt_6")*entity.loop(8));
        data.load(11, entity.getInterpolatedData("tmf:dyn/pt_6"));
    });
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setOffset(0, -8, 0);
    alien.setScale(1.35);

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