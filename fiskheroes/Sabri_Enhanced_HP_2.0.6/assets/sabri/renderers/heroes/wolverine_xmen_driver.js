extend("sabri:wolverine_xmen");
loadTextures({
    "layer1": "sabri:wolverine_xmen_driver_layer1",
    "layer2": "sabri:wolverine_xmen_driver_layer2",
    "layer2_jacket": "sabri:wolverine_xmen_driver_jacket_layer2"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "LEGGINGS") {
            return entity.getWornChestplate().suitType() == $SUIT_NAME ? "layer2_jacket" : "layer2";
        }
        return "layer1";
    });
}