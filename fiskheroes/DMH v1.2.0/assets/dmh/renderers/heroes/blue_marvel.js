extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:bm/layer1",
    "layer2": "dmh:bm/layer2"
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("fiskheroes:external/flames");

var hand_flames;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {

    var fire = renderer.createResource("ICON", "dmh:blue_fire_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x00adff);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:telekinesis_monitor");
	
    // Antimatter Beam
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "dmh:antimatter_beam", "body", 0x00adff, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    // Charged Energy Punch
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "dmh:empty", "rightArm", 0x00adff, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    // Concussive Force Blasts 
    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "dmh:concussive_force_blasts", "rightArm", 0x00adff, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [2.5, 2.5] },
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [2.5, 2.5], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer")));
    });

    utils.addFlightAnimation(renderer, "bluemarvel.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "bluemarvel.HOVER", "fiskheroes:flight/idle/default");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        hand_flames.render(entity.getInterpolatedData('fiskheroes:energy_charge'));
    }
}

