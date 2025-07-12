extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "shadows:nothing",
    "layer2": "shadows:nothing"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("backpack/backpack_0", "backpack/backpack_1", "backpack/backpack_2", "backpack/backpack_3");
}
