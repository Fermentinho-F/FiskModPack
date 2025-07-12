extend("sabri:quicksilver_xmen");
loadTextures({
    "layer1": "sabri:quicksilver_xmen_mcu_layer1",
    "layer2": "sabri:quicksilver_xmen_mcu_layer2"
});

function init(renderer) {
    renderer.setTexture((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.setItemIcons("%s_0", "%s_1", "%s_2", "%s_3");
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");

    initEffects(renderer);
    initAnimations(renderer);
}

function initEffects(renderer) {
    speedster.init(renderer, "sabri:quicksilver_xmen_mcu");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", null, "body", null, []);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("quicksilver.GLASSES");
}

function hasGlasses() {
    return false;
}