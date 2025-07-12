loadTextures({
    "base": "shadows:hunter/cross"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    renderer.setModel(utils.createModel(renderer, "shadows:hunter/cross", "base"));

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    glProxy.translate(0, -0.2, 0);
    if (renderType === "INVENTORY") {
        glProxy.translate(0.4, -0.1, 0);
        glProxy.scale(2.5);
        glProxy.rotate(20, 0.0 , 1.0, 0.0);
    }
}
