extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:fantastic4/invisible_woman_layer1",
    "layer2": "jmctheroes:fantastic4/fantastic_layer2"
});

var chest;
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}
function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);
    renderer.bindProperty("fiskheroes:opacity").setOpacity((entity, renderLayer) => {
        var timer = entity.getInterpolatedData("jmctheroes:dyn/invis_timer");
        var partial = Math.min(Math.max(entity.motion().length() / 20, 0), 0.7);
        return 1 + (partial - 1) * timer;
    });
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x1193D4);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    addAnimationWithData(renderer, "invisible.BLOCKING", "jmctheroes:shield/blocking", "fiskheroes:shield_blocking_timer");
}