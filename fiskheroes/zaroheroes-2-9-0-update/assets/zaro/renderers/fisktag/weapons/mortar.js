loadTextures({
    "base":      "fisktag:mortar",
    "crosshair": "fisktag:crosshairs/mortar"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:mortar", "base");
    model.bindAnimation("fisktag:mortar").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getInterpolatedData("fiskheroes:weapon_animation_spin_timer"));
    });

    renderer.setModel(model);
    
    utils.makeDilatingCrosshair(renderer, "crosshair", 30, 60, [
        { "pos": [8, 38], "size": [15, 22], "axis": [0, 1] }, // Bottom
        { "pos": [1, 28], "size": [7, 5], "axis": [-1, 0] }, // Left
        { "pos": [23, 28], "size": [7, 5], "axis": [1, 0] }, // Right
        { "pos": [13, 16], "size": [5, 7], "axis": [0, -1] } // Top
    ], 0, 3, 4);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:aiming_timer"));
        glProxy.rotate(-recoil * 5, 1, 0, 0);
        glProxy.translate(f * 0.2, recoil * 0.1, recoil * 0.7);
        glProxy.rotate(-3, 0, 0, 1);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        glProxy.translate(0, -0.05, -0.05);
        cancelAnimations = true;
    }
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
