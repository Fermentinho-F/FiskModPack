extend("fiskheroes:hero_basic");
loadTextures({
    "base": "fnaf:bonnie/bonnie",
    "lights": "fnaf:bonnie/bonnie_lights",
	"eyes": "fnaf:bonnie/eyes",
    "null": "fnaf:null"
});

var utils = implement("fiskheroes:external/utils");
var fnaf_utils = implement("fnaf:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        return "null";
    });

    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    head = fnaf_utils.createRabbitHeadWithJumpscare(renderer, "fnaf:bonnieHead", "base", "lights", "eyes", "fnaf:bonnie_jumpscare");
    body = fnaf_utils.createClassicBody(renderer, "base", "lights");

    utils.setOpacity(renderer, 0.99, 1.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "basic.JUMPSCARE", "fnaf:bonnie_jumpscare", "fnaf:dyn/jumpscare_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    body.render(entity, renderLayer, isFirstPersonArm);
    head.render(entity, renderLayer, isFirstPersonArm);
}