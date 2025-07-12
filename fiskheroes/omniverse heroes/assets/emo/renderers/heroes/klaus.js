extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:klaus",
    "layer2": "emo:klaus",
    "vampire": "emo:vampire_eyes",
    "hybrid": "emo:hybrid_eyes"
});

var utils = implement("fiskheroes:external/utils");

var vampire;
var hybrid;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    vampire = renderer.createEffect("fiskheroes:overlay");
    vampire.texture.set("vampire");

    hybrid = renderer.createEffect("fiskheroes:overlay");
    hybrid.texture.set("hybrid");

    utils.bindTrail(renderer, "emo:exblur");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        vampire.opacity = entity.getInterpolatedData("emo:dyn/sword_timer");
        vampire.render();
    }
    if (renderLayer == "CHESTPLATE") {
        hybrid.opacity = entity.getInterpolatedData("emo:dyn/el_timer");
        hybrid.render();
    }
}
