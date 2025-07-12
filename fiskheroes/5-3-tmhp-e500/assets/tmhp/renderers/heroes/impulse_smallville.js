extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/bart/smallville/layer1",
    "layer2": "tmhp:dc/flashfamily/bart/smallville/layer2",
    "stealth": "tmhp:dc/flashfamily/bart/smallville/stealth",
    "googles": "tmhp:dc/flashfamily/bart/smallville/mask.tx.json"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

var stealth;
var googles;

function init(renderer) {
    parent.init(renderer);

    googles = renderer.createEffect("fiskheroes:opening_mask");
    googles.setOffset(0.0, -2.2, -4.2).setRotation(-45.0, 0.0, 0.0);
    googles.texture.set("googles");
    googles.anchor.set("head");
}
function initEffects(renderer) {
    speedster.init(renderer);
    utils.bindTrail(renderer, "tmhp:kid_flash_yj").setCondition(entity => entity.getData("fiskheroes:speeding"));

    stealth = renderer.createEffect("fiskheroes:overlay");
    stealth.texture.set("stealth");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
       googles.render();
       googles.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
       stealth.opacity = entity.getData('tmhp:dyn/stealth_timer');
       stealth.render();
}
