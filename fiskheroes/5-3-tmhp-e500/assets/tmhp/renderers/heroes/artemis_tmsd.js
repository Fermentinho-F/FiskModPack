extend("tmhp:artemis");
loadTextures({
    "layer1": "tmhp:dc/young_justice/artemis/tmsd/layer1",
    "layer2": "tmhp:dc/young_justice/artemis/tmsd/layer2"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("%s_0", "%s_1", "artemis_2", "artemis_3");
}