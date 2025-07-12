loadTextures({
    "first_blade": "dmh:first_blade"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    var model = utils.createModel(renderer, "dmh:weapons/first_blade", "first_blade");
    renderer.setModel(model);

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    cancelAnimations = false;
    glProxy.translate(-0.5, 0.16, 0.9);
    glProxy.scale(1.5);
    glProxy.rotate(-90, 90, 0, 0);

    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.rotate(15, 0, -1, 0);
    }
    else if (renderType === "INVENTORY" || renderType === "ENTITY") {
        cancelAnimations = false;
        glProxy.translate(0.3, -0.1, -0.1);
    }
    else if (renderType === "EQUIPPED_IN_SUIT") {
        cancelAnimations = true;
    }
}
