loadTextures({
    "base":       "sl:gum",
    "base_lights": "sl:gum_lights"
});

var utils = implement("fisktag:external/utils");

var model;

function init(renderer) {
    model = utils.createModel(renderer, "sl:gum", "base", "base_lights");
    renderer.setModel(model);

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.scale(1.5, 1.5, 1.5);
        glProxy.rotate(0, 0, 0, 0);
        glProxy.translate(0.15, -0.2, 0);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {

        glProxy.scale(1.5, 1.5, 1.5 );
        glProxy.translate(-0.1, 0.0, 0);
    } else {
        glProxy.scale(1, 1, 1);
        glProxy.rotate(0, 0, 0, 0);
        glProxy.translate(0.2, -0.2, 0.5);
    }

    glProxy.translate(-0.35, 0, -0.55);

    glProxy.scale(1.5);
}