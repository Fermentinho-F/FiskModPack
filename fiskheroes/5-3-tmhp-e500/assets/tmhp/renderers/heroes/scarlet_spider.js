extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/ben/layer1",
    "layer2": "tmhp:marvel/spider_verse/ben/layer2",
    "blade": "tmhp:marvel/spider_verse/ben/blade"
});

var shield;

function initEffects(renderer) {
    shield = renderer.createEffect("fiskheroes:shield");
    shield.texture.set("blade");
    shield.anchor.set("rightArm");
    shield.setCurve(0.0, -2.0);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        shield.unfold = entity.getInterpolatedData("fiskheroes:blade_timer");
        shield.setOffset(-1, 8.0, -0.5);
        shield.render();
    }
}
