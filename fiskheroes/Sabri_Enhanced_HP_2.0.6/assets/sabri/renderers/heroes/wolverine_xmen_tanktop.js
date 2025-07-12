extend("sabri:wolverine_xmen");
loadTextures({
    "layer1": "sabri:wolverine_xmen_tanktop_layer1",
    "layer2": "sabri:wolverine_xmen_jacket_layer2"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("wolverine_xmen_jacket_0", "%s_1", "wolverine_xmen_jacket_2", "wolverine_xmen_jacket_3");
}