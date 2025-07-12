extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:destroyer",
    "layer2": "emo:destroyer"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    utils.bindParticles(renderer, "emo:destroyer").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") < 1);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:charged_beam", "head", 0xFF8400, [
        { "firstPerson": [3.0, 0.0, 2.0], "offset": [3.0, -4.0, -4.0], "size": [3.0, 2.0] },
        { "firstPerson": [-3.0, 0.0, 2.0], "offset": [-3.0, -4.0, -4.0], "size": [3.0, 2.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
}
