loadTextures({
    "base": "sabri:black_widow_bo_staff",
    "inventory": "sabri:inventory/black_widow_bo_staff"
});

var utils = implement("fisktag:external/utils");
var inventory_icon = implement("sabri:external/inventory_icon");

var icon;
var model;

function init(renderer) {
    icon = inventory_icon.create(renderer);
    icon.texture.set(null, "inventory");

    model = utils.createModel(renderer, "sabri:weapons/black_widow_bo_staff", "base");
    model.bindAnimation("sabri:black_widow_batons").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0, 0);
            data.load(1, 0);
            return;
        }
        data.load(0, entity.getInterpolatedData("sabri:dyn/baton_timer"));
        data.load(1, entity.getPunchTimerInterpolated());
    });

    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "INVENTORY") {
        icon.render(glProxy, isLeftSide, false);
        return;
    }

    cancelAnimations = true;
    if (renderType === "EQUIPPED") {
        cancelAnimations = false;
        glProxy.translate(0, -0.225 * (1 - entity.getInterpolatedData("sabri:dyn/baton_timer")), 0);
    }
    else if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.translate(0, -0.1, 0);
    }
    else if (renderType === "ENTITY") {
        glProxy.translate(0.0, -0.5, -0.55);
        glProxy.rotate(90, 1, 0, 0);
        cancelAnimations = true;
    }

    glProxy.translate(0, -1.875, -0.05);
    glProxy.scale(1.5);
    renderer.setModel(model);
}