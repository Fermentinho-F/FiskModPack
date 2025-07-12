extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:nova",
    "layer2": "emo:nova"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x40E7F9);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "fiskheroes:cold_beam", "rightArm", 0x40E7F9, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] },
        { "firstPerson": [4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5], "anchor": "leftArm" }
    ]);

    // charged beam
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0x40E7F9, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] },
        { "firstPerson": [4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    utils.addFlightAnimation(renderer, "mysterio.FLIGHT", "fiskheroes:flight/default.anim.json");
    utils.addHoverAnimation(renderer, "mysterio.HOVER", "fiskheroes:flight/idle/default");
}
