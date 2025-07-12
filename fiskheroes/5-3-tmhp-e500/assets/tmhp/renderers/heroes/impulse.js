extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/bart/impulse_yj/layer1",
    "layer2": "tmhp:dc/flashfamily/bart/impulse_yj/layer2",
    "stealth": "tmhp:dc/flashfamily/bart/impulse_yj/stealth_suit",
    "googles": "tmhp:dc/flashfamily/bart/impulse_yj/mask.tx.json",
    "googles_stealth": "tmhp:dc/flashfamily/bart/impulse_yj/stealth_mask.tx.json"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

var stealth;
var googles;
var googles_stealth;

function init(renderer) {
    parent.init(renderer);

    googles = renderer.createEffect("fiskheroes:opening_mask");
    googles.setOffset(0.0, -2.2, -4.2).setRotation(-45.0, 0.0, 0.0);
    googles.texture.set("googles");
    googles.anchor.set("head");

    googles_stealth = renderer.createEffect("fiskheroes:opening_mask");
    googles_stealth.setOffset(0.0, -2.2, -4.2).setRotation(-45.0, 0.0, 0.0);
    googles_stealth.texture.set("googles_stealth");
    googles_stealth.anchor.set("head");
}
function initEffects(renderer) {
    speedster.init(renderer);
    utils.bindTrail(renderer, "tmhp:kid_flash_yj").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.getData('tmhp:dyn/stealth'));
    utils.bindTrail(renderer, "tmhp:kid_flash_yj_stealth").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('tmhp:dyn/stealth'));

    stealth = renderer.createEffect("fiskheroes:overlay");
    stealth.texture.set("stealth");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET" && !entity.getData('tmhp:dyn/stealth')) {
       googles.render();
       googles.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
    if (renderLayer == "HELMET" && entity.getData('tmhp:dyn/stealth')) {
       googles_stealth.render();
       googles_stealth.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
       stealth.opacity = entity.getData('tmhp:dyn/stealth_timer');
       stealth.render();
}
