loadTextures({
    "base":        "fisktag:railgun",
    "crosshair":   "fisktag:crosshairs/railgun"
});

var utils = implement("fisktag:external/utils");
var teams = implement("fisktag:external/teams");
var railgun_charge = implement("fisktag:external/railgun_charge");

var model;
var lines;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:railgun", "base");
    renderer.setModel(model);

    utils.makeDilatingCrosshair(renderer, "crosshair", 16, 24, [
        { "pos": [6, 10], "size": [5, 5] }, // Center
        { "pos": [1, 4], "size": [4, 7], "axis": [-1, -0.5] }, // Top Left
        { "pos": [12, 4], "size": [4, 7], "axis": [1, -0.5] }, // Top Right
        { "pos": [1, 14], "size": [4, 7], "axis": [-1, 0.5] }, // Bottom Left
        { "pos": [12, 14], "size": [4, 7], "axis": [1, 0.5] }, // Bottom Right
        { "pos": [7, 1], "size": [3, 6], "axis": [0, -1] }, // Top
        { "pos": [7, 18], "size": [3, 6], "axis": [0, 1] } // Bottom
    ], 0, 3, 4);

    utils.bindScopedBeam(renderer, "fisktag:railgun_beam", teams.teamBasedColor(0xFF5500), [
        { "firstPerson": [-4.5, 3.8, -18.0], "offset": [-4.0, 21.0, -17.8], "size": [2.0, 2.0] }
    ], [3.5, -0.5, -5.0]);

    lines = railgun_charge.create(renderer, "fiskheroes:crab_cannon", 0xFFFFFF, 9, 3.1, 2.8, [1, 1]);
    lines.setOffset(0, 11.5, -4);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:scope_timer"));
        glProxy.rotate(-7 * f, 1, 0, 0);
        glProxy.translate(-0.1 * f, -0.1 * f, -0.2 * f + recoil * (0.7 - 0.2 * scopeTimer));
    }
    else if (renderType === "ENTITY" || renderType === "INVENTORY") {
        glProxy.translate(0, -0.1, 0.2);
    }

    glProxy.translate(0, -0.75, -0.55);
    glProxy.scale(0.85);
    teams.setTeamBasedTextures(entity, model.texture, true);

    if (renderType === "EQUIPPED" || renderType === "EQUIPPED_FIRST_PERSON") {
        lines.render(entity.getInterpolatedData("fiskheroes:weapon_animation_timer"), teams.getTeamBasedColor(entity, 0xFF5500));
    }
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
