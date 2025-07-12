extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/barry/yearone/layer1",
    "layer2": "tmhp:dc/flashfamily/barry/yearone/layer2",
    "googles": "tmhp:dc/flashfamily/barry/yearone/mask"
});

var speedster = implement("fiskheroes:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");
var googles;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
       if (renderLayer == "HELMET") {
           return "layer2";
       }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    googles = renderer.createEffect("fiskheroes:opening_mask");
    googles.setOffset(0.0, -2.2, -4.2).setRotation(-45.0, 0.0, 0.0);
    googles.texture.set("googles");
    googles.anchor.set("head");
}

function initEffects(renderer) {
    speedster.init(renderer, "tmhp:new52_yellow");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (renderLayer == "HELMET") {
       googles.render();
       googles.progress = entity.getData("fiskheroes:mask_open_timer2");
    }
}
