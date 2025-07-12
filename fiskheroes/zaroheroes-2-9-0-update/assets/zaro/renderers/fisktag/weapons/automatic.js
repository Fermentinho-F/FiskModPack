loadTextures({
    "base":        "zaro:automatic",
    "base_lights": "fisktag:automatic_lights",
    "crosshair":   "fisktag:crosshairs/automatic"
});

var utils = implement("fisktag:external/utils");
var teams = implement("fisktag:external/teams");

var model;
var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:automatic", "base", "base_lights");
    model.bindAnimation("fisktag:automatic").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0, 0);
            data.load(1, 0);
            return;
        }
        data.load(0, entity.getInterpolatedData("fiskheroes:aiming_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:weapon_animation_spin_timer"));
    });

    renderer.setModel(model);
    
    utils.makeDilatingCrosshair(renderer, "crosshair", 32, 30, [
        { "pos": [14, 13], "size": [5, 5] }, // Center
        { "pos": [11, 0], "size": [11, 5], "axis": [0, -1] }, // Top
        { "pos": [1, 18], "size": [7, 10], "axis": [-0.866, 0.5] }, // Bottom Left
        { "pos": [25, 18], "size": [7, 10], "axis": [0.866, 0.5] } // Bottom Right
    ], -3, 6, 6.66);

    bindBeam(renderer, "fiskheroes:heat_vision", teams.teamBasedColor(0x59FF83));
}

function bindBeam(renderer, beam, color) {
    var prop = renderer.bindBeamProperty();
    var constln = renderer.createResource("BEAM_CONSTELLATION", null);
    var b = constln.bindBeam({ "firstPerson": [0, 0, 0], "offset": [0, 0, 0], "size": [1.25, 1.25] });

    if (typeof beam === "string") {
        beam = renderer.createResource("BEAM_RENDERER", beam);
    }

    prop.setRenderer(beam);
    prop.setConstellation(constln);
    prop.setCondition(entity => {
        if (entity.ticksExisted() % 6 < 3) {
            b.offset.set(-4.0, 22.0, -10.5);
            b.firstPerson.set(-3.5, 7.5, -18.0);
        }
        else {
            b.offset.set(-3.9, 23.0, -6.5);
            b.firstPerson.set(-3.5, 9.5, -18.0);
        }
        prop.color.set(color(entity));
        return true;
    });
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = easeInOutSine(entity.getInterpolatedData("fiskheroes:aiming_timer"));
        glProxy.rotate(-5 * f, 1, 0, 0);
        glProxy.translate(0.2 * f, -0.2 + 0.2 * f, recoil * 0.2 + 0.1 * f);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        glProxy.translate(0, -0.6, -0.2);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED") {
        glProxy.translate(0, 0, 0.15 * entity.getInterpolatedData("fiskheroes:aiming_timer"));
    }
    glProxy.translate(0, -0.1, -0.9);
    glProxy.scale(0.85);
    teams.setTeamBasedTextures(entity, model.texture, true);
}

function easeInOutSine(x) {
    return -(Math.cos(Math.PI * x) - 1) / 2;
}
