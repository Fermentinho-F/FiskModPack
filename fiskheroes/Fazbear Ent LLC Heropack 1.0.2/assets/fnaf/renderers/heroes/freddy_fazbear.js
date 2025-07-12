extend("fiskheroes:hero_basic");
loadTextures({
    "base": "fnaf:freddy/freddy",
    "lights": "fnaf:freddy/freddy_lights",
    "eyes": "fnaf:freddy/eyes",
    "null": "fnaf:null",
    "unlit": "fnaf:freddy/freddy_unlit"
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
    head = fnaf_utils.createHeadWithJumpscare(renderer, "fnaf:freddyHead", "base", "lights", "eyes", "fnaf:freddy_jumpscare", "unlit");
    body = fnaf_utils.createClassicBody(renderer, "base", "lights");

    utils.setOpacity(renderer, 0.99, 1.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "basic.JUMPSCARE", "fnaf:freddy_jumpscare", "fnaf:dyn/jumpscare_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    body.render(entity, renderLayer, isFirstPersonArm);
    head.render(entity, renderLayer, isFirstPersonArm);
}