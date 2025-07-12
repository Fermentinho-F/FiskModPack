extend("fiskheroes:killer_frost_base");
loadTextures({
    "layer1": "emo:sage",
    "layer2": "emo:sage",
    "hands": "fiskheroes:killer_frost_hands"
});

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}