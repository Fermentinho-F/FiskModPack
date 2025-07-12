extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:nothing",
    "layer2": "shadows:nothing"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("custom/random/%s_0", "custom/random/%s_1", "custom/random/%s_2", "custom/random/%s_3");
}
