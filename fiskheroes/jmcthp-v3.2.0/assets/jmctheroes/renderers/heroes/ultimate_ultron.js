extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:ultron/ultimate_ultron_layer1",
    "layer2": "jmctheroes:ultron/ultimate_ultron_layer2",
    "layer1_lights": "jmctheroes:ultron/ultimate_ultron_lights_layer1",
    "layer2_lights": "jmctheroes:ultron/ultimate_ultron_lights_layer2"
});

var utils = implement("fiskheroes:external/utils");

var metal_heat;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights");
}

function initEffects(renderer) {
    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "jmctheroes:ultron/Head", "layer1", null));
    head.anchor.set("head");

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    var shake = renderer.bindProperty("fiskheroes:camera_shake").setCondition(entity => {
        shake.factor = entity.isSprinting() && entity.getData("fiskheroes:flying") ? 0.3 * Math.sin(Math.PI * entity.getInterpolatedData("fiskheroes:flight_boost_timer")) : 0;
        return true;
    });
    shake.intensity = 0.05;

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "jmctheroes:telekinesis_modok");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:charged_beam", "rightArm", 0xFF1000, [
        {"firstPerson": [-4.5, 4.75, -6], "offset": [ 0.5, 9.5, -1.5], "size": [0.5, 0.5] },    //
        {"firstPerson": [-4.5, 2.75, -6], "offset": [-2.0, 9.5, -1.625], "size": [0.5, 0.5] },  //
        {"firstPerson": [-4.0, 2.75, -6],"offset": [-2.0, 9.5, -0.75], "size": [0.5, 0.5] },    //
        {"firstPerson": [-3.5, 2.75, -6], "offset": [-2.0, 9.5, 0.25], "size": [0.5, 0.5] },    //
        {"firstPerson": [-3.0, 2.75, -6], "offset": [-2.0, 9.5, 1.25], "size": [0.5, 0.5] }     //
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    var red_fire = renderer.createResource("ICON", "fiskheroes:red_fire_layer_%s");
    
    back_boosters1 = renderer.createEffect("fiskheroes:booster");
    back_boosters1.setIcon(red_fire).setOffset(-2.0, 2.5, 2.0).setSize(1.5, 4.0);
    back_boosters1.anchor.set("body");
    back_boosters1.mirror = true;
    back_boosters1.opacity = 0.1;
    back_boosters2 = renderer.createEffect("fiskheroes:booster");
    back_boosters2.setIcon(red_fire).setOffset(-1.75, 4.0, 2.0).setSize(1.5, 4.0);
    back_boosters2.anchor.set("body");
    back_boosters2.mirror = true;
    back_boosters2.opacity = 0.1;
    back_boosters3 = renderer.createEffect("fiskheroes:booster");
    back_boosters3.setIcon(red_fire).setOffset(-1.5, 6.5, 2.0).setSize(1.5, 3.0);
    back_boosters3.anchor.set("body");
    back_boosters3.mirror = true;
    back_boosters3.opacity = 0.1;
    
    metal_heat = renderer.createEffect("fiskheroes:metal_heat");
    metal_heat.includeEffects(head);

    var heat = 0xFF4F00;
    arms_heat = utils.createLines(renderer, "jmctheroes:energy_hands", heat, [
        {"start": [0.0, 0.0, 0.0], "end": [0.0, -0.5, 0.0], "size": [4.8, 4.8]},
        {"start": [0.04, -0.055, -0.1575], "end": [0.04, -0.4, -0.1575], "size": [0.1, 1.5]},
        {"start": [0.04, -0.055, 0.1575], "end": [0.04, -0.4, 0.1575], "size": [0.1, 1.5]}
    ]);
    arms_heat.anchor.set("rightArm");
    arms_heat.setOffset(1.0, 10.10, 0.0).setRotation(0, 0, 0.0).setScale(16.0, 12.0, 16.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimation(renderer, "ultron.TELEKINESIS", "fiskheroes:aiming_fpcorr").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("jmctheroes:dyn/0_timer")));
    }).priority = 10;
    utils.addFlightAnimation(renderer, "ultron.FLIGHT", "fiskheroes:flight/propelled.anim.json");
    utils.addHoverAnimation(renderer, "ultron.HOVER", "fiskheroes:flight/idle/manta");
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");
    
    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
    .priority = 10;
}

function hasBootLights() {
    return true;
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
        head.render();
    }
    metal_heat.opacity = entity.getInterpolatedData("fiskheroes:metal_heat");
    metal_heat.render();
    if (renderLayer == "CHESTPLATE") {
        arms_heat.opacity = entity.getInterpolatedData("fiskheroes:blade_timer");
        arms_heat.render();
    }
    if (!isFirstPersonArm) {
        var boost = entity.getInterpolatedData("fiskheroes:flight_boost_timer");
        if (renderLayer == "CHESTPLATE") {
            back_boosters1.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            back_boosters1.speedScale = 0.5 * boost;
            back_boosters1.flutter = 1 + boost;
            back_boosters1.setRotation(20 - 10 * boost, 0, -25);
            back_boosters1.render();
            back_boosters2.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            back_boosters2.speedScale = 0.5 * boost;
            back_boosters2.flutter = 1 + boost;
            back_boosters2.setRotation(20 - 10 * boost, 0, -15);
            back_boosters2.render();
            back_boosters3.progress = entity.getInterpolatedData("fiskheroes:dyn/booster_timer");
            back_boosters3.speedScale = 0.5 * boost;
            back_boosters3.flutter = 1 + boost;
            back_boosters3.setRotation(20 - 10 * boost, 0, -10);
            back_boosters3.render();
        }
    }
}
