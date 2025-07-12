extend("tmhp:spider_gwen");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/gwen/marvel/hooded",
    "hood_open": "tmhp:marvel/spider_verse/gwen/marvel/layer1",
    "layer2": "tmhp:marvel/spider_verse/gwen/default/layer2",
    "mask": "tmhp:marvel/spider_verse/gwen/marvel/mask",
    "web_wings": "tmhp:marvel/spider_verse/gwen/marvel/wings"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("%s_0", "%s_1", "spider_gwen_2", "spider_gwen_3");
}