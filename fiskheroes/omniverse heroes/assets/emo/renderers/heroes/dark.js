extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:dark",
    "layer2": "emo:dark"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.bindTrail(renderer, "emo:blur_black");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
    }
}