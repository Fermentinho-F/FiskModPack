extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:quicksilver_xmen_layer1",
    "layer2": "sabri:quicksilver_xmen_layer2",
    "glasses": "sabri:quicksilver_xmen_glasses"
});

var speedster = implement("fiskheroes:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    renderer.setTexture((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.setItemIcons("%s_0", "%s_1", "%s_2", "%s_3");
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");

    initEffects(renderer);
    initAnimations(renderer);
}

function initEffects(renderer) {
    var model = renderer.createResource("MODEL", "sabri:head_model");
    model.bindAnimation("sabri:glasses_up").setData((entity, data) => {
        return data.load(0, entity.getData("fiskheroes:mask_open") ? Math.min((1 - entity.getInterpolatedData("fiskheroes:mask_open_timer2")) * 2, 1) : Math.max((1 - entity.getInterpolatedData("fiskheroes:mask_open_timer2")) * 1.3 - 0.3, 0))
    });
    model.texture.set("glasses");
    glasses = renderer.createEffect("fiskheroes:model").setModel(model);
    glasses.anchor.set("head");
    glasses.setOffset(0, -24, 0);

    speedster.init(renderer, "sabri:quicksilver_xmen");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", null, "body", null, []);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");

    addAnimation(renderer, "quicksilver.GLASSES", "sabri:toggle_glasses")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(1 - f < 1 ? 1 - f : 0);
        });
}

function hasGlasses() {
    return true;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET" && hasGlasses()) {
        /*Days of Future Past #SOON
        glasses.setOffset(0, -24, 0.5 * (1 - entity.getInterpolatedData("fiskheroes:mask_open_timer2")));
        glasses.setScale(1, 1, 1 + 0.085 * (1 - entity.getInterpolatedData("fiskheroes:mask_open_timer2")));*/
        glasses.render();
    }
}
