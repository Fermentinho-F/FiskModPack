extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:sn/michael/michael_l1",
    "layer2": "dmh:sn/michael/michael_l2",
    "eyes": "dmh:sn/eyes/blue_eyes",
    "wings": "dmh:sn/misc/angel_wings",
    "blank": "dmh:null"
});

var utils = implement("fiskheroes:external/utils");

var overlay;
var wings;

function init(renderer) {
    parent.init(renderer);

    renderer.setLights((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "eyes";
        }
        return "blank";
    });

}

function initEffects(renderer) {
    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getData("fiskheroes:mask_open"));

    utils.bindParticles(renderer, "dmh:smite").setCondition(entity => entity.getData("fiskheroes:beam_charging"));
    utils.bindParticles(renderer, "dmh:heal").setCondition(entity => entity.getData("fiskheroes:energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "dmh:invis", "body", 0xFFFFFF, [{
        "firstPerson": [0, 0, 0],
        "offset": [0, 0, 0],
        "size": [0, 0]
    }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "dmh:archangel_impact_light"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "dmh:invis", "body", 0xFFFFFF, [{
        "firstPerson": [0, 0, 0],
        "offset": [0, 0, 0],
        "size": [0, 0]
    }
    ]);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "dmh:concussive_force_blasts", "rightArm", 0x00adff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [2.5, 2.5] },
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [2.5, 2.5], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    model_wings = renderer.createResource("MODEL", "dmh:wings");
    model_wings.texture.set("wings");
    model_wings.bindAnimation("dmh:flap").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(2, entity.loop(16));
    });

    wings = renderer.createEffect("fiskheroes:model").setModel(model_wings);
    wings.setOffset(0, 1, -1.6);
    wings.setScale(1.4);
    wings.anchor.set("body");
}


function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer")));
    });

    addAnimationWithData(renderer, "michael.AIMING", "fiskheroes:aiming", "dmh:dyn/transform_timer").priority = 10;

    addAnimation(renderer, "michael.CHARGED_BEAM", "fiskheroes:aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(0, entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 2, 1) : 0);
        data.load(1, Math.max(charge - 0.5, 0) * 2);
    });
    addAnimation(renderer, "michael.ENERGY_PROJ", "fiskheroes:aiming").setData((entity, data) => {
        var energy_proj = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        data.load(0, entity.getData("fiskheroes:energy_projection") ? Math.min(energy_proj * 2, 1) : 0);
        data.load(1, Math.max(energy_proj - 0.5, 0) * 2);
    });

    /** addAnimation(renderer, "michael.CHARGED_BEAM", "dmh:aiming", "dmh:dyn/transform_timer").priority = 10;
    addAnimation(renderer, "michael.ENERGY_PROJECTION", "dmh:aiming", "dmh:dyn/transform_timer").priority = 10; **/


    utils.addFlightAnimation(renderer, "michael.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "michael.HOVER", "fiskheroes:flight/idle/neutral");

    addAnimationWithData(renderer, "michael.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        wings.opacity = Math.min(entity.getInterpolatedData("fiskheroes:flight_timer") * 2, 1);
        wings.render();
    }
}
