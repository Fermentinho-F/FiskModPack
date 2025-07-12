loadTextures({
    "base": "swhp:ambanphasepulseblaster",
    "scope": "fisktag:scopes/sniper",
    "crosshair": "fisktag:crosshairs/sniper"
});

var utils = implement("fisktag:external/utils");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "swhp:ambanphasepulseblaster", "base");
    renderer.setModel(model);
    scope = renderer.bindOverlay();

    utils.makeDilatingCrosshair(renderer, "crosshair", 22, 18, [
        { "pos": [9, 7], "size": [5, 5] }, // Center
        { "pos": [1, 7], "size": [8, 5], "axis": [-1, 0] }, // Left
        { "pos": [14, 7], "size": [8, 5], "axis": [1, 0] }, // Right
        { "pos": [9, 1], "size": [5, 6], "axis": [0, -1] }, // Top
        { "pos": [9, 12], "size": [5, 6], "axis": [0, 1] } // Bottom
    ], 18, 18);

    utils.bindScopedBeam(renderer, "fisktag:sniper_beam", 0xFFFF00, [
        { "firstPerson": [-4.5, 4.3, -22.0], "offset": [-5.2, 25.0, -20.5], "size": [1.0, 1.0] },
        { "firstPerson": [-4.5, 3.0, -22.0], "offset": [-5.0, 24.0, -22.0], "size": [1.0, 1.0] }
    ], [4.5, -1.3, 2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType == "HUD") {
        scope.texture.set("scope");
        scope.opacity = scopeTimer * scopeTimer * scopeTimer;
        renderer.crosshair.opacity = 1 - scope.opacity;
    }
    else {
        if (renderType === "EQUIPPED_FIRST_PERSON") {
            renderer.opacity = 1 - scopeTimer * scopeTimer * scopeTimer;
            glProxy.translate(scopeTimer * -0.054, scopeTimer * -0.15, scopeTimer * 0.53);
            glProxy.translate(0, 0, recoil * 0.6);
            glProxy.translate(0, -0.75, -0.6);
        }
        else {
            if (renderType === "ENTITY" || renderType === "INVENTORY") {
                glProxy.translate(0, -0.05, 0.55);
            }
            renderer.opacity = 1;
            glProxy.translate(0, -0.7, -0.7);
        }
    
        glProxy.scale(0.85);
    }
}