extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:front_man/front_man_l1",
    "layer2": "dmh:front_man/front_man_l2",
});

function init(renderer) {
    parent.init(renderer);

    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "front_man.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });
}

function render(entity, renderLayer, isFirstPersonArm) {
}

