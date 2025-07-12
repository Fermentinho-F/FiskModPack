extend("fiskheroes:hero_basic");
loadTextures({
    "base": "fnaf:freddy/golden_freddy",
    "lights": "fnaf:null",
    "eyes": "fnaf:freddy/eyes",
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
    head = fnaf_utils.createHeadWithJumpscare(renderer, "fnaf:freddyHead", "base", "lights", "eyes", "fnaf:golden_freddy_jumpscare");
    body = fnaf_utils.createClassicBody(renderer, "base", "lights");

    utils.setOpacity(renderer, 0.99, 1.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
	
    addAnimation(renderer, "freddy.IDLE", "fnaf:golden_freddy").setData((entity, data) => {
        data.load(1);
    })
    renderer.reprioritizeDefaultAnimation("PUNCH", -1);
}

function render(entity, renderLayer, isFirstPersonArm) {
    body.render(entity, renderLayer, isFirstPersonArm);
    head.render(entity, renderLayer, isFirstPersonArm);
}