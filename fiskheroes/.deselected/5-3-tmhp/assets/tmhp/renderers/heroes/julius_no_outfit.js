extend("tmhp:julius");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null"
});

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}