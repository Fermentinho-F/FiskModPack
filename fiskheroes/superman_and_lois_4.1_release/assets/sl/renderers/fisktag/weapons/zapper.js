loadTextures({
    "base": "sl:zapper",
});

var utils = implement("fisktag:external/utils");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "sl:zapper", "base");
    renderer.setModel(model);

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", 0x42c94b, [
        { "firstPerson": [-2.5, 3.75, -7.0], "offset": [0, 9.0, 0.0], "size": [0.4, 0.4] }
    ]);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.scale(1.5, 1.5, 1.5);
        glProxy.rotate(0, 0, 0, 0);
        glProxy.translate(-0.15, -0.2, 0);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {

        glProxy.scale(2, 2, 2 );
        glProxy.translate(-0.3, -0.2, 0);
    } else {
        glProxy.scale(1, 1, 1);
        glProxy.rotate(0, 0, 0, 0);
        glProxy.translate(-0.2, -0.2, 0);
    }

    glProxy.scale(1.5);
}