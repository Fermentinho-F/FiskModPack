extend("jmctheroes:spider_man");
loadTextures({
    "layer1": "jmctheroes:spiderman/spider_man_1610_layer1",
    "layer2": "jmctheroes:spiderman/spider_man_1610_layer2",
    "spidersense": "jmctheroes:spiderman/spidersense"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x53469C);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.PROP_FLIGHT")
    addAnimation(renderer, "doublejump.ROLL", "jmctheroes:swing_roll6")
    .setData((entity,data) => data.load(entity.getData("jmctheroes:dyn/double_jump") ? 
    Math.min(Math.max(entity.getInterpolatedData("jmctheroes:dyn/jump_animation") / 2.0, 0), 1) : 0))
    .setCondition(entity => entity.getData("jmctheroes:dyn/choose_jump_animation") > -1);
    
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", ["fiskheroes:swing_right", "jmctheroes:swing_right2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", ["fiskheroes:swing_left", "jmctheroes:swing_left2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", ["jmctheroes:swing_right2", "fiskheroes:swing_default"]);

}