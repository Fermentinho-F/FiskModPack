extend("fiskheroes:spider_man");
loadTextures({
    "layer1": "tmhp:marvel/spider_verse/peter/ff/layer1",
    "layer2": "tmhp:marvel/spider_verse/peter/ff/layer2",
    "stealth": "tmhp:marvel/spider_verse/peter/ff/stealth"
});

var overlay;


function initEffects(renderer) {
  overlay = renderer.createEffect("fiskheroes:overlay");
  overlay.texture.set("stealth");
}

function render(entity, renderLayer, isFirstPersonArm) {
  overlay.opacity = entity.getInterpolatedData("tmhp:dyn/stealth_timer");
  overlay.texture.set("stealth");
  overlay.render();
}