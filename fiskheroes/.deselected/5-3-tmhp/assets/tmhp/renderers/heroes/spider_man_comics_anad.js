extend("tmhp:spider_man_comics");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/peter/anad/layer1",
    "layer2": "tmhp:marvel/spider_verse/peter/anad/layer2",
    "lights":"tmhp:marvel/spider_verse/peter/anad/lights"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? null : "lights");
}
