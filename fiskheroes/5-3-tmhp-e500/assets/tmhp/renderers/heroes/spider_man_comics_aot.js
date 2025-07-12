extend("tmhp:spider_man_comics");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/peter/custom/aot_layer1"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("spider_man_comics_0", "%s_1", "spider_man_comics_2", "spider_man_comics_3");
}