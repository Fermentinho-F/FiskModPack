loadTextures({
    "base":        "zaro:tesla_gun",
    "base_lights": "fisktag:tesla_gun_lights",
    "crosshair":   "fisktag:crosshairs/tesla_gun"
});

var utils = implement("fisktag:external/utils");
var teams = implement("fisktag:external/teams");
var tesla_charge = implement("fisktag:external/tesla_gun_charge");

var model;
var lines;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:tesla_gun", "base", "base_lights");
    model.bindAnimation("fisktag:tesla_gun").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0, 0);
            data.load(1, 0);
            return;
        }
        data.load(0, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:weapon_animation_timer"));
    });

    renderer.setModel(model);
    
    utils.makeDilatingCrosshair(renderer, "crosshair", 22, 20, [
        { "pos": [8, 0], "size": [7, 3], "axis": [0, -1] }, // Top
        { "pos": [1, 14], "size": [4, 6], "axis": [-0.866, 0.5] }, // Bottom Left
        { "pos": [18, 14], "size": [4, 6], "axis": [0.866, 0.5] } // Bottom Right
    ], -3, 6, 6.66);

    utils.bindBeam(renderer, "fisktag:tesla_gun", teams.teamBasedColor(0xA2FFCE), [
        { "firstPerson": [-3.7, 9.0, -15.0], "offset": [-3.0, 18.0, -6.5], "size": [1, 1] }
    ]);

    lines = tesla_charge.create(renderer, "fisktag:tesla_gun_charge", 0, [
        { "start": [0, -1, 0], "size": [0.5, 0.5] },
        { "start": [0.866, 0.5, 0], "size": [0.5, 0.5] },
        { "start": [-0.866, 0.5, 0], "size": [0.5, 0.5] }
    ]);
    lines.effect.setOffset(0, 11, -9);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:aiming_timer"));
        glProxy.translate(0.2 * f, -0.2 + 0.1 * f, recoil * 0.4 + 0.2 * f);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        glProxy.translate(0, -0.65, 0.4);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED") {
        glProxy.translate(0, 0, 0.15 * entity.getInterpolatedData("fiskheroes:aiming_timer"));
    }
    glProxy.translate(0, -0.1, -0.9);
    glProxy.scale(0.85);
    teams.setTeamBasedTextures(entity, model.texture, true);

    if (renderType === "EQUIPPED" || renderType === "EQUIPPED_FIRST_PERSON") {
        var t = entity.getInterpolatedData("fiskheroes:weapon_animation_timer");
        var t1 = easeInOutSine(t);
        var t2 = 2.70158 * t * t * t - 1.70158 * t * t;
        var off = -18;
        var scale = 1.3;
        var l = 19.5;
        var a = 40 * Math.PI / 180;

        off += 6 * t1;
        off += l * (1 - Math.cos(t2 * a));
        scale += l * Math.sin(t2 * a) - t1;
        lines.effect.opacity = t;
        lines.effect.color.set(teams.getTeamBasedColor(entity, 0xA2FFCE));
        lines.render(off, t1 * 360, scale);
    }
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
