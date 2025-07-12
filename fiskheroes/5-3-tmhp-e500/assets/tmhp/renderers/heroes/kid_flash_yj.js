extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/wally/yj/layer1",
    "layer2": "tmhp:dc/flashfamily/wally/yj/layer2",
    "stealth": "tmhp:dc/flashfamily/wally/yj/stealth",
    "artic_stealth": "tmhp:dc/flashfamily/wally/yj/stealth_artic",
    "googles": "tmhp:dc/flashfamily/wally/yj/googles",
    "googles_stealth": "tmhp:dc/flashfamily/wally/yj/stealth_googles",
    "googles_artic": "tmhp:dc/flashfamily/wally/yj/stealth_artic_googles"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");

var stealth;
var artic_stealth;
var googles;
var googles_stealth;
var googles_artic;

function init(renderer) {
    parent.init(renderer);

    googles = renderer.createEffect("fiskheroes:opening_mask");
    googles.setOffset(0.0, 2.0, 0.5).setRotation(3.5, 0.0, 0.0);
    googles.texture.set("googles");
    googles.anchor.set("head");

    googles_stealth = renderer.createEffect("fiskheroes:opening_mask");
    googles_stealth.setOffset(0.0, 2.0, 0.5).setRotation(3.5, 0.0, 0.0);
    googles_stealth.texture.set("googles_stealth");
    googles_stealth.anchor.set("head");

    googles_artic = renderer.createEffect("fiskheroes:opening_mask");
    googles_artic.setOffset(0.0, 2.0, 0.5).setRotation(3.5, 0.0, 0.0);
    googles_artic.texture.set("googles_artic");
    googles_artic.anchor.set("head");
}
function initEffects(renderer) {
    speedster.init(renderer);
    utils.bindTrail(renderer, "tmhp:kid_flash_yj").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.getData('tmhp:dyn/stealth') && !entity.getData('tmhp:dyn/artic_stealth'));
    utils.bindTrail(renderer, "tmhp:kid_flash_yj_stealth").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('tmhp:dyn/stealth'));
    utils.bindTrail(renderer, "tmhp:kid_flash_yj_artic").setCondition(entity => entity.getData("fiskheroes:speeding") && entity.getData('tmhp:dyn/artic_stealth'));

    stealth = renderer.createEffect("fiskheroes:overlay");
    stealth.texture.set("stealth");
    artic_stealth = renderer.createEffect("fiskheroes:overlay");
    artic_stealth.texture.set("artic_stealth");
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
    if (renderLayer == "HELMET" && entity.getData('tmhp:dyn/artic_stealth')) {
       googles_artic.render();
       googles_artic.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
       stealth.opacity = entity.getData('tmhp:dyn/stealth_timer');
       stealth.render();
       artic_stealth.opacity = entity.getData('tmhp:dyn/artic_stealth_timer');
       artic_stealth.render();
}
