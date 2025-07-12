extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:nothing",
    "layer2": "shadows:nothing",
    "shadow_dome": "shadows:nothing"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("CHESTPLATE", "hidden/forced_sentry/%s");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    var dome = renderer.bindProperty("fiskheroes:shadowdome");
    dome.texture.set("shadow_dome");
}
