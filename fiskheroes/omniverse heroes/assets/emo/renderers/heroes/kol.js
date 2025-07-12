extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:kol",
    "layer2": "emo:kol",
    "vampire": "emo:vampire_eyes"
});

var utils = implement("fiskheroes:external/utils");

var vampire;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    vampire = renderer.createEffect("fiskheroes:overlay");
    vampire.texture.set("vampire");

    utils.bindTrail(renderer, "emo:exblur");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        vampire.opacity = entity.getInterpolatedData("emo:dyn/sword_timer");
        vampire.render();
    }
}
