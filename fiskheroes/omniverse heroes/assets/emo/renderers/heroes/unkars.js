extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:unkars",
    "layer2": "emo:unkars",
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

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

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0x9B00FF, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"))
    utils.bindTrail(renderer, "fiskheroes:lightning_zoom_pink");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}
