extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/bart/kf_yj/layer1",
    "layer2": "tmhp:dc/flashfamily/bart/kf_yj/layer2",
    "googles": "tmhp:dc/flashfamily/bart/kf_yj/googles"
});

var speedster = implement("fiskheroes:external/speedster_utils");
var googles;

function init(renderer) {
    parent.init(renderer);
    googles = renderer.createEffect("fiskheroes:opening_mask");
    googles.setOffset(0.0, -2.0, -1.5).setRotation(-20.0, 0.0, 0.0);
    googles.texture.set("googles");
    googles.anchor.set("head");
}

function initEffects(renderer) {
    speedster.init(renderer, "tmhp:kid_flash_yj");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "HELMET") {
       googles.render();
       googles.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
}

