extend("fiskheroes:hero_basic");
loadTextures({
    "base": "fnaf:chica/chica",
    "lights": "fnaf:chica/chica_lights",
	"eyes": "fnaf:chica/eyes",
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
    head = fnaf_utils.createHeadWithJumpscare(renderer, "fnaf:chicaHead", "base", "lights", "eyes", "fnaf:chica_jumpscare");
    body = fnaf_utils.createClassicBody(renderer, "base", "lights");

    utils.setOpacity(renderer, 0.99, 1.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "basic.JUMPSCARE", "fnaf:chica_jumpscare", "fnaf:dyn/jumpscare_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    body.render(entity, renderLayer, isFirstPersonArm);
    head.render(entity, renderLayer, isFirstPersonArm);
}