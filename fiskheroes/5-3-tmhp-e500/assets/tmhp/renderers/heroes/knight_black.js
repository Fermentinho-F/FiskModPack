extend("tmhp:knight");
loadTextures({
    "layer1": "tmhp:history/knight_black",
    "cape": "tmhp:history/knight_black_cape"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("%s_0", "%s_1", "knight_2", "knight_3");
}