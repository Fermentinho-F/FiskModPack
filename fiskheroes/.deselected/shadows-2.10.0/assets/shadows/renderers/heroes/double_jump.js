extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "shadows:nothing",
    "layer2": "shadows:nothing"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcon("CHESTPLATE", "hidden/double_jump/%s");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}
function initEffects(renderer) {
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.PROP_FLIGHT");


    addAnimation(renderer, "doublejump.SPRINGBOARD", "fiskheroes:swing_springboard")
    .setData((entity,data) => data.load(entity.getData("shadows:dyn/double_jump") ? Math.min(Math.max(entity.getInterpolatedData("shadows:dyn/jump_animation") / 1.5, 0), 1) : 0))
    .setCondition(entity => entity.getData("shadows:dyn/choose_jump_animation") == 0);


    addAnimation(renderer, "doublejump.ROLLFIVE", "fiskheroes:swing_roll5")
    .setData((entity,data) => data.load(entity.getData("shadows:dyn/double_jump") ? Math.min(Math.max(entity.getInterpolatedData("shadows:dyn/jump_animation") / 1.5, 0), 1) : 0))
    .setCondition(entity => entity.getData("shadows:dyn/choose_jump_animation") == 1);

    addAnimation(renderer, "doublejump.ROLL", "fiskheroes:swing_roll")
    .setData((entity,data) => data.load(entity.getData("shadows:dyn/double_jump") ? Math.min(Math.max(entity.getInterpolatedData("shadows:dyn/jump_animation") / 1.5, 0), 1) : 0))
    .setCondition(entity => entity.getData("shadows:dyn/choose_jump_animation") == 2);
}
