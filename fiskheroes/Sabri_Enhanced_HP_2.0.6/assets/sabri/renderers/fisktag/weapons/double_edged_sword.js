loadTextures({
    "base": "sabri:double_edged_sword",
    "inventory": "sabri:inventory/double_edged_sword"
});

var utils = implement("fisktag:external/utils");
var inventory_icon = implement("sabri:external/inventory_icon");

var icon;
var model;

function init(renderer) {
    icon = inventory_icon.create(renderer);
    icon.texture.set(null, "inventory");

    model = utils.createModel(renderer, "sabri:weapons/double_edged_sword", "base");
    model.bindAnimation("sabri:double_edged_sword").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0, 0);
            data.load(1, 0);
            return;
        } 
        data.load(0, entity.getInterpolatedData("sabri:dyn/shield_blocking_timer"));
        data.load(1, entity.loop(3));
    });

    utils.addPlayerAnimation(renderer, "fiskheroes:aiming").setData((entity, data) => {
        data.load(entity.getInterpolatedData("sabri:dyn/shield_blocking_timer"));
    });

    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "INVENTORY") {
        icon.render(glProxy, isLeftSide, false);
        return;
    }

    cancelAnimations = false;

    if (renderType === "ENTITY") {
        glProxy.translate(-0.15, -0.5, -0.15);
        glProxy.rotate(-90, 0, 0, 1);
        cancelAnimations = true;
    }

    glProxy.translate(0, -1.225, -0.05);
    glProxy.scale(1.5);
    renderer.setModel(model);
}