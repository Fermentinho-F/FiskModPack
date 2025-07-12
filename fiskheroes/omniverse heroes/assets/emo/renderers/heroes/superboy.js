extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:sb",
    "layer2": "emo:sb"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x6EFF00);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-3.5, 2.0, 3.0], "rotation": [0.0, -90.0, 60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 3.0);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam", "head", 0x40E7F9, [
        { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindTrail(renderer, "emo:blur_black");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
    }
}