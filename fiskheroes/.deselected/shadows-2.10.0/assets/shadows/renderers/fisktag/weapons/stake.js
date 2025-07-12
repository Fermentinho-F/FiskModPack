loadTextures({
    "base": "shadows:hunter/stake"
});

var utils = implement("fisktag:external/utils");

function init(renderer) {
    renderer.setModel(utils.createModel(renderer, "shadows:hunter/stake", "base"));

}

function render(renderer, entity, glProxy, renderType, scopeTimer, recoil, isLeftSide) {
    glProxy.translate(0, -0.1, 0);
    if (renderType === "INVENTORY") {
        glProxy.translate(0.3, -0.1, 0);
        glProxy.scale(1.5);
    }
}
