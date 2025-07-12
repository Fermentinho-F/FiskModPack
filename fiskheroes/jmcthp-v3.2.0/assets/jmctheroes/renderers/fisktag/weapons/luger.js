loadTextures({
    "base": "jmctheroes:luger_bw",
    "crosshair": "jmctheroes:crosshairs/luger"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "jmctheroes:guns/Luger", "base");
    renderer.setModel(model);
    utils.makeDilatingCrosshair(renderer, "crosshair", 18, 18, [
        { "pos": [8, 8], "size": [3, 3] }, // Center
        { "pos": [8, 3], "size": [3, 4], "axis": [0, -2] }, // Top
        { "pos": [3, 8], "size": [4, 3], "axis": [-2, 0] }, // Left
        { "pos": [12, 8], "size": [4, 3], "axis": [2, 0] }, // Right
        { "pos": [8, 12], "size": [3, 4], "axis": [0, 2] } // Bottom
    ], 0, 6, 6.66);

    utils.bindScopedBeam(renderer, "jmctheroes:gunshot", 0x63737F, [
        { "firstPerson": [-5.0, 2.8, -16.0], "offset": [-0.55, 14.5, -2.75], "size": [0.5, 0.5] }
    ], [5.0, -1.5, -0.75]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.translate(0, -0.05, 0);
        recoil *= 20.0;
        glProxy.rotate(-recoil, 1, 0, 0);
    }
    else if (renderType === "ENTITY") {
        glProxy.translate(0, -0.1, 0);
        cancelAnimations = true;
    }
    else if (renderType === "INVENTORY") {
        glProxy.translate(0, -0.15, 0);
        glProxy.scale(1.5);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED") {
        recoil *= 20.0;
        glProxy.rotate(-recoil, 1, 0, 0);
    }
    glProxy.translate(0, -1.85, -0.075);
    glProxy.scale(1.5);
}