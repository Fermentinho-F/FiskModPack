extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:red2",
    "layer2": "emo:red2"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "emo:invisible_beam", "body", 0xFF0000, [
        { "firstPerson": [0, 5, -9], "offset": [0.0, 4.0, -6.0], "size": [12.0, 12.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "emo:clap", "fiskheroes:beam_charge");
}