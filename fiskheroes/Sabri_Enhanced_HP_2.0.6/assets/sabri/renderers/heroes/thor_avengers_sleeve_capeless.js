extend("sabri:thor");
loadTextures({
    "layer1": "sabri:thor_avengers_sleeve_capeless_layer1"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("thor_0", "%s_1", "thor_2", "thor_3");
}

function hasCape() {
    return false;
}