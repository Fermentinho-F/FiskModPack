extend("fiskheroes:spider_man");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/peter/custom/tmsd_layer1",
    "layer2": "tmhp:marvel/spider_verse/peter/custom/tmsd_layer2",
    "lights": "tmhp:marvel/spider_verse/peter/custom/tmsd_lights",
    "mask_lights": "tmhp:marvel/spider_verse/peter/custom/mask_lights",
    "mask": "tmhp:marvel/spider_verse/peter/custom/mask",
    "stealth": "tmhp:marvel/spider_verse/peter/custom/tmsd_stealth",
    "stealth_lights": "tmhp:marvel/spider_verse/peter/custom/tmsd_stealth_lights"
});

var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return "mask";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.setLights((entity, renderLayer) => {
        if (renderLayer == "HELMET") {
            return "mask_lights";
        }
        return renderLayer == "LEGGINGS" ? null : "lights";
    });
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
        "tmhp:spectacular_dive",
        "tmhp:swing_and_relax"
    ]);
}

function initEffects(renderer) {
  overlay = renderer.createEffect("fiskheroes:overlay");
  overlay.texture.set("stealth", "stealth_lights");
}

function render(entity, renderLayer, isFirstPersonArm) {
  overlay.opacity = entity.getInterpolatedData("tmhp:dyn/stealth_timer");
  overlay.texture.set("stealth", "stealth_lights");
  overlay.render();
}