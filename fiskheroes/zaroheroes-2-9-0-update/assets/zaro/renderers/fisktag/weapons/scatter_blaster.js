loadTextures({
    "base":      "zaro:scatter_blaster",
    "crosshair": "fisktag:crosshairs/scatter_blaster"
});

var utils = implement("fisktag:external/utils");
var teams = implement("fisktag:external/teams");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "fisktag:scatter_blaster", "base");
    renderer.setModel(model);

    renderer.crosshair.texture.set("crosshair");
    renderer.crosshair.width = 68;
    renderer.crosshair.height = 26;

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", teams.teamBasedColor(0xF97A63), [
        { "firstPerson": [-4.3, 4.0, -16.0], "offset": [-3.3, 17.9, -14.2], "size": [1.5, 1.0] }
    ]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.translate(0, 0, recoil * 0.5);
    }
    else if (renderType === "ENTITY" || renderType === "INVENTORY") {
        glProxy.translate(0, -0.15, 0.2);
    }

    glProxy.translate(0, -0.75, -0.55);
    glProxy.scale(0.85);
    teams.setTeamBasedTextures(entity, model.texture, false);
}
