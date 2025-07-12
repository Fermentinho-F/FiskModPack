extend("fiskheroes:hero_basic");
loadTextures({
    "base": "fnaf:foxy/foxy",
    "lights": "fnaf:foxy/foxy_lights",
	"eyes": "fnaf:foxy/eyes",
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
    head = fnaf_utils.createHeadWithJumpscare(renderer, "fnaf:foxyHead", "base", "lights", "eyes", "fnaf:foxy_jumpscare");
    body = fnaf_utils.createClassicFoxyBody(renderer, "base", "lights");

    utils.setOpacity(renderer, 0.99, 1.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "alex.IDLE", "fnaf:alex_idle").setData((entity, data) => {data.load(1);})
    addAnimationWithData(renderer, "basic.JUMPSCARE", "fnaf:foxy_jumpscare", "fnaf:dyn/jumpscare_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    body.render(entity, renderLayer, isFirstPersonArm);
    head.render(entity, renderLayer, isFirstPersonArm);
}