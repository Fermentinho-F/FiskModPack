loadTextures({
    "angel_blade": "dmh:angel_blade"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    var model = utils.createModel(renderer, "dmh:weapons/angel_blade", "angel_blade");
    renderer.setModel(model);

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    glProxy.translate(0.0, -1.55, -0.1);
    glProxy.scale(1.1);
    glProxy.rotate(0, 0, 0, 0);

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.rotate(15, 0, -1, 0);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        cancelAnimations = false;
        glProxy.translate(0.2, 0.0, 0.0);
        glProxy.scale(1.1);
    }
    else if (renderType === "EQUIPPED_IN_SUIT") {
        cancelAnimations = true;
    }
}
