extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:bizarro",
    "layer2": "emo:bizarro"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:mysterio_beam", "head", 0xFF4D00, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam", "head", 0x40E7F9, [
        { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindTrail(renderer, "emo:blur_black");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "lightning.FLIGHT", "fiskheroes:flight/propelled_hands.anim.json");
    utils.addHoverAnimation(renderer, "lightning.HOVER", "fiskheroes:flight/idle/propelled_hands");
}