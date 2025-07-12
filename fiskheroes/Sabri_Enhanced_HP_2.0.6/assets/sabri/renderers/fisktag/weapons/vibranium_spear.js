loadTextures({
    "base": "sabri:vibranium_spear",
    "inventory": "sabri:inventory/vibranium_spear"
});

var utils = implement("fisktag:external/utils");
var inventory_icon = implement("sabri:external/inventory_icon");

var icon;
var model;

function init(renderer) {
    icon = inventory_icon.create(renderer);
    icon.texture.set(null, "inventory");

    model = utils.createModel(renderer, "sabri:weapons/vibranium_spear", "base");
    model.bindAnimation("sabri:vibranium_spear").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getInterpolatedData("sabri:dyn/sneak_timer"))
    });

    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "INVENTORY") {
        icon.render(glProxy, isLeftSide, false);
        return;
    }

    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.translate(0, -0.5, 0);
        cancelAnimations = true;
    }
    else if (renderType === "ENTITY") {
        glProxy.translate(0.0, -0.5, -0.45);
        glProxy.rotate(90, 1, 0, 0);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED") {
        glProxy.translate(0, 0, 0.15 * entity.getInterpolatedData("fiskheroes:aiming_timer"));
    }

    var p = entity.getInterpolatedData("sabri:dyn/sneak_timer")

    glProxy.translate(0, -0.55, -0.05);
    glProxy.scale(1.5);
    renderer.setModel(model);
}