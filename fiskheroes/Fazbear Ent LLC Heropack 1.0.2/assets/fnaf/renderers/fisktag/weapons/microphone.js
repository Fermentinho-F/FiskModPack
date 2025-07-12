loadTextures({
    "base": "fnaf:mic"
});

var utils = implement("fisktag:external/utils");

var model;
var cancelAnimations = false;

function init(renderer) {
    var model = utils.createModel(renderer, "fnaf:mic", "base");
    renderer.setModel(model);
}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
	cancelAnimations = false;
    if (renderType === "EQUIPPED_FIRST_PERSON") {
        glProxy.scale(1.5);
    } else if (renderType === "ENTITY") {
        glProxy.scale(1.5);
        glProxy.rotate(90, 1, 0, 0);
        glProxy.rotate(90, 0, 1, 0);
        glProxy.translate(0.0, -0.15, 0.0);
    } else if (renderType === "INVENTORY") {
        glProxy.scale(3.0);
        glProxy.rotate(-45, 0, 1, 0);
        glProxy.rotate(-30, 0, 0, 1);
        glProxy.rotate(180, 0, 1, 0);
        glProxy.translate(0.0, -0.03, 0.08);
    } else if (renderType === "EQUIPPED") {
        glProxy.scale(1.5);
    }
}
