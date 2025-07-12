loadTextures({
    "base":        "zaro:rocket_launcher",
    "scope":       "fisktag:scopes/rocket_launcher",
    "crosshair":   "fisktag:crosshairs/rocket_launcher"
});

var utils = implement("fisktag:external/utils");
var teams = implement("fisktag:external/teams");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:rocket_launcher", "base");
    renderer.setModel(model);
    utils.addPlayerAnimationWithData(renderer, "fisktag:dual_hand", "fiskheroes:aiming_timer");

    scope = renderer.bindOverlay();
    scope.texture.set("scope");

    utils.makeDilatingCrosshair(renderer, "crosshair", 26, 26, [
        { "pos": [11, 11], "size": [5, 5] }, // Center
        { "pos": [1, 11], "size": [10, 5], "axis": [-1, 0] }, // Left
        { "pos": [16, 11], "size": [10, 5], "axis": [1, 0] }, // Right
        { "pos": [11, 16], "size": [5, 10], "axis": [0, 1] }, // Bottom
    ], 5, 5, 10);

    utils.bindScopedBeam(renderer, "fisktag:rocket_launcher_beam", 0x00FFFF, [
        { "firstPerson": [-5.0, 2.5, -18.0], "offset": [-1.5, 24.0, -5.5], "size": [5.0, 5.0] }
    ], [-3.0, -3.5, -18.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType == "HUD") {
        scope.texture.set("scope");
        scope.opacity = scopeTimer * scopeTimer * scopeTimer;
        renderer.crosshair.opacity = 1 - scope.opacity;
    }
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:scope_timer"));
        renderer.opacity = 1 - scopeTimer * scopeTimer * scopeTimer;
        glProxy.translate(-0.4685 * f, -0.279 * f + recoil * 0.2, 0.34 * f + recoil * 1.2);
        glProxy.rotate(-10 * f - 5 * recoil, 1, 0, 0);
        glProxy.translate(0, 0, -0.05);
    }
    else {
        if (renderType === "EQUIPPED") {
            var aiming = easeInOutSine(entity.getInterpolatedData("fiskheroes:aiming_timer"));
            glProxy.rotate(45.0 * aiming, 1.0, 0.0, 0.0);
            glProxy.rotate(-10.0 * aiming, 0.0, 1.0, 0.0);
        }
        else if (renderType === "ENTITY" || renderType === "INVENTORY") {
            glProxy.translate(0, 0.1, -0.25);
        }
        renderer.opacity = 1;
    }
    glProxy.translate(0, -0.75, -0.55);
    glProxy.scale(0.85);
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}