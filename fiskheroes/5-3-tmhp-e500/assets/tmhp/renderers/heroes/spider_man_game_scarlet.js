extend("tmhp:spider_man_game");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/thampson/layer1",
    "layer2": "tmhp:marvel/spider_verse/thampson/layer2",
    "mask": "tmhp:marvel/spider_verse/thampson/mask"
});
function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open_timer2")) {
            return "mask";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
}
