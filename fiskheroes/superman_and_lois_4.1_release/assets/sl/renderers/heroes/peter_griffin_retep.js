extend("sl:peter_griffin");
loadTextures({
    "layer1": "sl:griffin_retep_layer1",
    "layer2": "sl:griffin_retep_layer2",
    "layer1_damaged": "sl:griffin_retep_layer1_damaged",
    "griffintbl": "sl:griffin_retep",
});

function init(renderer) {
renderer.setTexture((entity, renderLayer) => {
  if (entity.isWearingFullSuit()) {
    return "null";
    } else {
    if (entity.getHealth() > 10) {
        if (renderLayer === "LEGGINGS") {
            return "layer2";
        } else {
            return "layer1";
        }
    } else if (entity.getHealth() <= 10) {
        if (renderLayer === "LEGGINGS") {
            return "layer2";
        } else {
            return "layer1_damaged";
        }
    }
  }
});

    renderer.setItemIcons("griffin_0", "griffin_retep_1", "griffin_retep_2", "griffin_3");
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET");

    initEffects(renderer);
    initAnimations(renderer);
}