extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:invisible_woman",
    "layer2": "zaro:invisible_woman"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
  
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFFD3A8);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
     renderer.removeCustomAnimation("basic.BLOCKING");
}

