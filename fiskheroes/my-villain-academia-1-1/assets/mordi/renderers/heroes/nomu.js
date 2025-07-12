extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "mordi:nomu/nomu_layer1",
    "layer2": "mordi:nomu/nomu_layer1",
});

var utils = implement("fiskheroes:external/utils");

var scabbard;

function initEffects(renderer) {
    scabbard = renderer.createEffect("fiskheroes:model");
    scabbard.anchor.set("body");

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");
}
