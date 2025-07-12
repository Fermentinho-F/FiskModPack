extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/peter/tls/layer1",
    "layer2": "tmhp:marvel/spider_verse/peter/tls/layer2",
    "mask": "tmhp:marvel/spider_verse/peter/tls/mask"
});

var collar;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return "mask";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    collar = renderer.createEffect("fiskheroes:ears");
    collar.anchor.set("head");
    collar.angle = -7;
    collar.inset = -0.09;
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        collar.render();
    }
}