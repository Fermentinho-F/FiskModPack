loadTextures({
    "base": "sabri:black_widow_batons",
    "inventory": "sabri:inventory/black_widow_batons"
});

var utils = implement("fisktag:external/utils");
var inventory_icon = implement("sabri:external/inventory_icon");

var icon;
var model;

function init(renderer) {
    icon = inventory_icon.create(renderer);
    icon.texture.set(null, "inventory");

    model = utils.createModel(renderer, "sabri:weapons/black_widow_batons", "base");
    model.bindAnimation("sabri:black_widow_batons").setData((entity, data) => {
        if (equipment || cancelAnimations) {
            if (equipment) {
                data.load(1, 1);
            } else {
                data.load(1, 0);
            }
            data.load(0, 0);
            return;
        } 
        data.load(0, entity.getInterpolatedData("sabri:dyn/baton_timer"));
        data.load(1, 0);
    });

    utils.addPlayerAnimation(renderer, "sabri:dual_punch").setData((entity, data) => {
        data.load(entity.isPunching() ? 1 : 0);
    });

    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "INVENTORY") {
        icon.render(glProxy, isLeftSide, true);
        return;
    }

    equipment = false;
    cancelAnimations = true;

    if (renderType === "EQUIPPED") {
        cancelAnimations = false;
    }
    else if (renderType === "EQUIPPED_IN_SUIT") {
        equipment = true;
    }
    else if (renderType === "ENTITY") {
        glProxy.translate(0.0, -0.5, 0.2);
        glProxy.rotate(90, 1, 0, 0);
        cancelAnimations = true;
    }

    glProxy.translate(0, -1.875, -0.05);
    glProxy.scale(1.5);
    renderer.setModel(model);
}