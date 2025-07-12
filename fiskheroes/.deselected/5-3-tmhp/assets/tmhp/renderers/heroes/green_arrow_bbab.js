extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/green_arrow/bbab/layer1",
    "layer2": "tmhp:dc/green_arrow/bbab/layer2",
    "arrow": "tmhp:dc/green_arrow/default/arrow",
    "quiver": "tmhp:dc/green_arrow/bbab/quiver"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
}