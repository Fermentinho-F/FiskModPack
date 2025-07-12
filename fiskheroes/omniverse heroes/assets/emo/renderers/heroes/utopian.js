extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:utopian",
    "layer2": "emo:utopian",
    "cape": "emo:red_cape"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 1.3;
    physics.maxFlare = 0.6;
    physics.flareDegree = 1.5;
    physics.flareFactor = 1.2;
    physics.flareElasticity = 5;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 16;

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0x00AAFF, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "emo:invisible_beam", "body", 0xFF0000, [
        { "firstPerson": [0, 5, -9], "offset": [0.0, 4.0, -6.0], "size": [12.0, 12.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindTrail(renderer, "emo:blur");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "emo:clap", "fiskheroes:beam_charge");
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
}
