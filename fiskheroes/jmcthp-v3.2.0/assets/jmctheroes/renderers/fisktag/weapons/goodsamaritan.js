loadTextures({
    "base": "jmctheroes:the_good_samaritan",
    "crosshair": "jmctheroes:crosshairs/revolver"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "jmctheroes:guns/TheGoodSamaritan", "base");
    model.bindAnimation("jmctheroes:TheGoodSamaritan").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getInterpolatedData("fiskheroes:weapon_animation_spin_timer"));
    });

    renderer.setModel(model);
    utils.makeDilatingCrosshair(renderer, "crosshair", 18, 18, [
        { "pos": [8, 8], "size": [3, 3] }, // Center
        { "pos": [8, 1], "size": [3, 5], "axis": [0, -1] }, // Top
        { "pos": [1, 8], "size": [5, 3], "axis": [-1, 0] }, // Left
        { "pos": [13, 8], "size": [5, 3], "axis": [1, 0] }, // Right
        { "pos": [8, 13], "size": [3, 5], "axis": [0, 1] } // Bottom
    ], 0, 6, 6.66);

    utils.bindScopedBeam(renderer, "jmctheroes:gunshot", 0xCBC96B, [
        { "firstPerson": [-5.0, 1.5, -16.0], "offset": [-0.55, 15.0, -4.75], "size": [0.5, 0.5] }
    ], [5.0, -1.75, -0.75]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        recoil *= 20.0;
        glProxy.rotate(-recoil, 1, 0, 0);
    }
    else if (renderType === "ENTITY") {
        cancelAnimations = true;
    }
    else if (renderType === "INVENTORY") {
        glProxy.scale(1.2);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED") {
        recoil *= 20.0;
        glProxy.rotate(-recoil, 1, 0, 0);
    }
    glProxy.translate(0, -1.05, -0.52);
    glProxy.scale(1.0);
}