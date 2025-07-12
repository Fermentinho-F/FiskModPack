var LOADTEXTURES = {
    "null": "tmf:null",
    "stinkfly": "tmf:omnitrix/p1/aliens/stinkfly",
    "stinkfly_lights": "tmf:omnitrix/p1/lights/stinkfly_lights_base",
    "web_small": "tmf:omnitrix/p1/aliens/stinkfly_web_small",
    "web_large": "tmf:omnitrix/p1/aliens/stinkfly_web_large"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p1").setCondition(entity => isCurrent(entity));
    
    var model_StinkflyArm = renderer.createResource("MODEL", "tmf:omnitrix/aliens/stinkflyArm");
    model_StinkflyArm.texture.set("stinkfly");
    var stinkflyArm = renderer.createEffect("fiskheroes:model").setModel(model_StinkflyArm);
    stinkflyArm.anchor.set("rightArm");

    var stinkflyGoo = renderer.bindProperty("fiskheroes:webs");
    stinkflyGoo.textureSmall.set("web_small");
    stinkflyGoo.textureLarge.set("web_large");
    stinkflyGoo.setCondition(entity => isCurrent(entity));

    addAnimation(renderer, "stinkfly.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));
  
    utils.addFlightAnimation(renderer, "stinkfly.FLIGHT", "fiskheroes:flight/propelled_hands.anim.json").setCondition(entity => isCurrent(entity));
    utils.addHoverAnimation(renderer, "stinkfly.HOVER", "fiskheroes:flight/idle/propelled_hands").setCondition(entity => isCurrent(entity));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", null, "body", null, []).setCondition(entity => isCurrent(entity));
    return {
        getTexture: entity => "null",
        render: (entity, isFirstPersonArm) => {
            if (!isFirstPersonArm) {
                alien.render(pull(entity, "color"), pull(entity, "timeout"));
                badge.render(pull(entity, "color"), pull(entity, "timeout"));
                
            }
            if (isFirstPersonArm) {
                stinkflyArm.render();
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_stinkfly" : "tmf:omnitrix/aliens/stinkfly");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/stinkfly").setData((entity, data) => {
        data.load(0, entity.loop(60));
        data.load(1, entity.getPunchTimerInterpolated());
        data.load(2, entity.getInterpolatedData('fiskheroes:flight_timer'));
        data.load(3, entity.getInterpolatedData('tmf:dyn/pc_1'));
        data.load(4, entity.loop(3));
        data.load(5, entity.getInterpolatedData('tmf:dyn/pt_1'));
        data.load(6, entity.getInterpolatedData('fiskheroes:beam_charge'));
        });
        modelAlien.texture.set("stinkfly", "stinkfly_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);	
    alien.setOffset(0,2,0);

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