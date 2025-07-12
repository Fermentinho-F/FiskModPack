loadTextures({
    "base": "swhp:dc15s",
    "scope":       "fisktag:scopes/rifle",
    "crosshair":   "fisktag:crosshairs/rifle"
});

var utils = implement("fisktag:external/utils");

var model;
var scope;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "swhp:dc15s", "base");
    model.bindAnimation("fisktag:rifle").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getInterpolatedData("fiskheroes:weapon_animation_spin_timer"));
    });

    renderer.setModel(model);
    
    scope = renderer.bindOverlay();
    scope.texture.set("scope");
    
    utils.makeDilatingCrosshair(renderer, "crosshair", 12, 10, [
        { "pos": [1, 1], "size": [5, 9], "axis": [-1, 0] }, // Left
        { "pos": [7, 1], "size": [5, 9], "axis": [1, 0] } // Right
    ], 3, 5, -10);

    utils.bindScopedBeam(renderer, "fiskheroes:repulsor_blast", 0x00FFFF, [
        { "firstPerson": [-5.0, 4.0, -18.0], "offset": [-3.2, 16.0, -14.0], "size": [1.5, 2.5] }
    ], [5.0, 0.0, 8.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType == "HUD") {
        scope.texture.set("scope");
        scope.opacity = scopeTimer * scopeTimer * scopeTimer;
        renderer.crosshair.opacity = 1 - scope.opacity;
    }
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        renderer.opacity = 1 - scopeTimer * scopeTimer * scopeTimer;
        glProxy.translate(scopeTimer * -0.001, -scopeTimer * 0.1135, scopeTimer * 0.54);
        glProxy.translate(0, 0, recoil * 0.4);
    }
    else {
        if (renderType === "INVENTORY" || renderType === "ENTITY") {
            glProxy.translate(0, 0, -0.15);
            cancelAnimations = true;
        }
        renderer.opacity = 1;
    }

    glProxy.translate(0, -0.75, -0.6);
    glProxy.scale(0.85);
}