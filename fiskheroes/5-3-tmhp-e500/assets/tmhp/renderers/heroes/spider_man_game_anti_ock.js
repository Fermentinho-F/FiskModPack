extend("tmhp:spider_man_game");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/peter/ps4/anti_ock_layer1",
    "layer2": "tmhp:marvel/spider_verse/peter/ps4/anti_ock_layer2",
    "lights":"tmhp:marvel/spider_verse/peter/ps4/anti_ock_lights"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? null : "lights");
}
