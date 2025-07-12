extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:sn/dean/dean_l1",
    "layer2": "dmh:sn/dean/dean_l2",
    "eyes": "dmh:sn/dean/dean+eyes"
});

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "eyes";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

}

function initEffects(renderer) {
    var night_vision = renderer.bindProperty("fiskheroes:night_vision").setCondition(entity => entity.getData("fiskheroes:mask_open"));

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "dean.AIMING", "fiskheroes:aiming", "dmh:dyn/transform_timer").priority = 10;

}

function render(entity, renderLayer, isFirstPersonArm) {

}
