loadTextures({
    "base":        "zaro:burst_rifle",
    "base_lights": "fisktag:burst_rifle_lights",
    "crosshair":   "fisktag:crosshairs/burst_rifle"
});

var utils = implement("fisktag:external/utils");
var teams = implement("fisktag:external/teams");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:burst_rifle", "base", "base_lights");
    model.bindAnimation("fisktag:burst_rifle").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0);
            return;
        }
        data.load(entity.getInterpolatedData("fiskheroes:weapon_animation_spin_timer"));
    });

    renderer.setModel(model);
    
    utils.makeDilatingCrosshair(renderer, "crosshair", 20, 20, [
        { "pos": [1, 8], "size": [7, 5], "axis": [-1, 0] }, // Left
        { "pos": [13, 8], "size": [7, 5], "axis": [1, 0] }, // Right
        { "pos": [8, 1], "size": [5, 7], "axis": [0, -1] }, // Top
        { "pos": [8, 13], "size": [5, 7], "axis": [0, 1] } // Bottom
    ], 3, 5);

    utils.bindScopedBeam(renderer, "fiskheroes:repulsor_blast", teams.teamBasedColor(0xFF973D), [
        { "firstPerson": [-4.8, 3.0, -20.0], "offset": [-3.6, 17.8, -16.4], "size": [1.25, 1.25] }
    ], [4.15, -0.9, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:scope_timer"));
        glProxy.rotate(-9 * f, 1, 0, 0);
        glProxy.translate(-0.1 * f, -0.05 * f, -0.15 - 0.15 * f + recoil * (0.2 - 0.1 * scopeTimer));
    }
    else if (renderType === "EQUIPPED") {
        glProxy.translate(0, 0.08, -0.1);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        glProxy.translate(0, 0, -0.15);
        cancelAnimations = true;
    }

    glProxy.translate(0, -0.75, -0.6);
    glProxy.scale(0.85);
    teams.setTeamBasedTextures(entity, model.texture, true);
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
