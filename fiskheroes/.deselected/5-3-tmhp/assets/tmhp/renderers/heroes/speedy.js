extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/teen_titans/speedy/layer1",
    "layer2": "tmhp:dc/teen_titans/speedy/layer2",
    "arrow": "tmhp:dc/teen_titans/speedy/arrow",
    "quiver": "tmhp:dc/teen_titans/speedy/quiver"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
}