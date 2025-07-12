loadTextures({
    "base": "swhp:ib94",
    "crosshair": "fisktag:crosshairs/pistol"
});

var utils = implement("fisktag:external/utils");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "swhp:ib94", "base");
    renderer.setModel(model);

    utils.makeDilatingCrosshair(renderer, "crosshair", 16, 8, [
        { "pos": [6, 1], "size": [5, 7] }, // Center
        { "pos": [1, 1], "size": [5, 7], "axis": [-1, 0] }, // Left
        { "pos": [11, 1], "size": [5, 7], "axis": [1, 0] } // Right
    ], 0, 4, 12.5);

    utils.bindScopedBeam(renderer, "fiskheroes:repulsor_blast", 0xFFFF00, [
        { "firstPerson": [-10.0, 4.5, -18.0], "offset": [0.0, 15.0, -4.0], "size": [0.1, 0.1] }
    ], [3.0, -2.0, -2.0]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    glProxy.translate(0, -0.85, -0.52);

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = 1 - scopeTimer * 0.4;
        recoil *= 0.7;
        glProxy.translate(-Math.sin(entity.getInterpolatedData("fiskheroes:scope_timer") * Math.PI / 2) * 0.25, 0.1, 0.3 * recoil);
        glProxy.rotate(-recoil * (20 - scopeTimer * 7), 1, 0, 0);
        glProxy.translate(0.02 * recoil * (1 - scopeTimer), -0.04 * recoil * f, (Math.sin(recoil * Math.PI) * 0.1) * f);
    }

    glProxy.scale(0.7);
}