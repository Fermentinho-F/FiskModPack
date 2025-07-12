loadTextures({
    "base":        "fisktag:shotgun",
    "base_lights": "fisktag:shotgun_lights",
    "crosshair":   "fisktag:crosshairs/shotgun"
});

var utils = implement("fisktag:external/utils");
var teams = implement("fisktag:external/teams");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:shotgun", "base", "base_lights");
    renderer.setModel(model);

    utils.makeDilatingCrosshair(renderer, "crosshair", 16, 16, [
        { "pos": [6, 6], "size": [5, 5] }, // Center
        { "pos": [1, 1], "size": [5, 5], "axis": [-1, -1] }, // Top Left
        { "pos": [11, 1], "size": [5, 5], "axis": [1, -1] }, // Top Right
        { "pos": [1, 11], "size": [5, 5], "axis": [-1, 1] }, // Bottom Left
        { "pos": [11, 11], "size": [5, 5], "axis": [1, 1] } // Bottom Right
    ], 3, 4, 3.33);

    utils.bindScopedBeam(renderer, "fiskheroes:repulsor_blast", teams.teamBasedColor(0x7BD4FF), [
        { "firstPerson": [-5.0, 4.0, -18.0], "offset": [-3.2, 16.0, -14.0], "size": [1.25, 1.25] }
    ], [4.0, -1.0, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:scope_timer"));
        glProxy.rotate(-7 * f, 1, 0, 0);
        glProxy.translate(-0.1 * f, -0.1 * f, -0.2 * f + recoil * (0.7 - 0.2 * scopeTimer));
    }
    else if (renderType === "EQUIPPED") {
        glProxy.translate(0, 0.08, -0.1);
    }
    else if (renderType === "ENTITY" || renderType === "INVENTORY") {
        glProxy.translate(0, 0.05, -0.2);
    }

    glProxy.translate(0, -0.75, -0.6);
    glProxy.scale(0.85);
    teams.setTeamBasedTextures(entity, model.texture, true);
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
