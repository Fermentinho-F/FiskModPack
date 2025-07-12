var LOADTEXTURES = {
	"null": "tmf:null",
	"swampfire": "tmf:omnitrix/p3/aliens/swampfire",
	"swampfire_lights": "tmf:omnitrix/p3/lights/swampfire.tx.json"
};

var IMPLEMENTS = {
    utils: "fiskheroes:external/utils"
};

function init(renderer, getAlien, isCurrent) {
    var alien = alienModel(renderer, false);
    var badge = alienModel(renderer, true);

    utils.bindParticles(renderer, "tmf:alien_particles_p3").setCondition(entity => isCurrent(entity));
        
    var modelSwampfireFp = renderer.createResource("MODEL", "tmf:omnitrix/aliens/swampfire_arm");
    modelSwampfireFp.texture.set("swampfire");
    var swampfireFp = renderer.createEffect("fiskheroes:model").setModel(modelSwampfireFp);
    swampfireFp.anchor.set("rightArm");
    swampfireFp.setOffset(0, -2, 0);
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "tmf:fire_beam", "body", 0xF3985B, [
        { "firstPerson": [0.0, 4.75, -10.0], "offset": [0.0, 3.0, -6.0], "size": [3.0, 3.0, -3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => isCurrent(entity));


    addAnimation(renderer, "swampfire.ARM", "tmf:omnitrix/powers/remove_arm").setData((entity, data) => {
        data.load(0, 1);
        }).setCondition(entity => isCurrent(entity));

        utils.addFlightAnimation(renderer, "swampfire.FLIGHT", "fiskheroes:flight/propelled_hands.anim.json").setCondition(entity => isCurrent(entity));
    return {
        getTexture: entity => "null",
        getLights: entity => ("null"),
        render: (entity, isFirstPersonArm) => {
            if (isFirstPersonArm) {
                swampfireFp.render();  
            }
            if (!isFirstPersonArm) {
                alien.render();
                badge.render(pull(entity, "color"), pull(entity, "timeout"), entity.getWornChestplate().nbt().getString("HeroType") == "tmf:omni_recal");
            }
        }
    };
}

function alienModel(renderer, badge) {
    var modelAlien = renderer.createResource("MODEL", badge ? "tmf:omnitrix/device/badge_swampfire" : "tmf:omnitrix/aliens/swampfire");
    modelAlien.bindAnimation("tmf:omnitrix/aliens/swampfire").setData((entity, data) => {
        data.load(0, entity.getPunchTimerInterpolated());
        data.load(1, entity.isSneaking() ? 1 : 0);
        data.load(2, entity.loop(64));
        data.load(3, entity.getInterpolatedData("fiskheroes:heat_vision_timer"));
        data.load(5, entity.getInterpolatedData("tmf:dyn/pc_1"));
        data.load(6, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(7, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(8, entity.getInterpolatedData("fiskheroes:scale"));
    });
    modelAlien.texture.set("swampfire", "swampfire_lights");
    var alien = renderer.createEffect("fiskheroes:model").setModel(modelAlien);
    alien.anchor.ignoreAnchor(true);
    alien.setScale(0.85);
    alien.setOffset(0,4,0);

    return {
        modelAlien: modelAlien,
        alien: alien,
        render: (color, timeout, recal) => {
            if (badge) {
                if (timeout) {
                    modelAlien.texture.set("omnitrix_recal", "omnitrix_timeout");
                }
                else if ((color == 0 && !recal) || color == 360) {
                    modelAlien.texture.set("omnitrix_recal", "omnitrix_white");
                }
                else {
                    modelAlien.texture.set("omnitrix_recal", "omnitrix_lights");
                }
            }
            alien.render();
        }
    };
}