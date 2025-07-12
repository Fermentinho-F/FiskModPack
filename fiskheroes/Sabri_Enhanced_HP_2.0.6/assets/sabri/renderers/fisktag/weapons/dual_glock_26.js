loadTextures({
    "base": "sabri:glock_26",
    "crosshair": "sabri:crosshairs/glock_26"
});

var utils = implement("fisktag:external/utils");

var cancelAnimations = false;

function init(renderer) {
    model = utils.createModel(renderer, "sabri:weapons/glock_26", "base");
    model.bindAnimation("sabri:glock_26").setData((entity, data) => {
        if (cancelAnimations) {
            data.load(0, 0);
            data.load(1, 0);
            return;
        }
        data.load(0, entity.getInterpolatedData("fiskheroes:weapon_animation_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:reload_timer"))
    });

    renderer.setModel(model);

    utils.makeDilatingCrosshair(renderer, "crosshair", 20, 20, [
        { "pos": [8, 8], "size": [5, 5] }, // Center
        { "pos": [1, 8], "size": [5, 5], "axis": [-1, 0] }, // Left
        { "pos": [15, 8], "size": [5, 5], "axis": [1, 0] }, // Right
        { "pos": [8, 1], "size": [5, 5], "axis": [0, -1] }, // Top
        { "pos": [8, 15], "size": [5, 5], "axis": [0, 1] } // Bottom
    ], 2, 2);

    utils.bindScopedBeam(renderer, "sabri:glock_26", 0xFFFFFF, [
        { "firstPerson": [-5.5, 5.0, -16.0], "offset": [-0.5, 12.1, -3.5], "size": [1.0, 1.0] }
    ], [3.0, -2.0, -2.0]);

    utils.addPlayerAnimation(renderer, "sabri:reload_gun").setData((entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:reload_timer"));
    });
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    glProxy.translate(-0.05, -1.825, -0.175);
    
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        var f = 1 - scopeTimer * 0.4;
        recoil *= 0.7;
        glProxy.translate(-Math.sin(entity.getInterpolatedData("fiskheroes:scope_timer") * Math.PI / 2) * 0.25, 0.1, 0.2 * recoil);
        glProxy.rotate(-recoil * (20 - scopeTimer * 7), 1, 0, 0);
        glProxy.translate(0.02 * recoil * (1 - scopeTimer), -0.04 * recoil * f, (Math.sin(recoil * Math.PI) * 0.1) * f);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        glProxy.translate(0.0, -1.0, 0.0);
        glProxy.scale(1.75);
        cancelAnimations = true;
    }
    else if (renderType === "EQUIPPED_IN_SUIT") {
        cancelAnimations = true;
    }

    glProxy.scale(1.5);
}
