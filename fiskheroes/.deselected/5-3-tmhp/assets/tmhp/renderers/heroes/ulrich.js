extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:lyoko_warriors/ulrich_layer1",
    "layer2": "tmhp:lyoko_warriors/ulrich_layer2",
    "katana": "tmhp:lyoko_warriors/ulrich_katana"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    speedster.init(renderer);
    utils.addLivery(renderer, "KATANA", "katana");
    utils.bindTrail(renderer, "tmhp:ulrich");
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
