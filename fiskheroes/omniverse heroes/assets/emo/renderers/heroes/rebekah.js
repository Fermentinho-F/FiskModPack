extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:rebekah",
    "layer2": "emo:rebekah",
    "vampire": "emo:vampire_eyes"
});

var utils = implement("fiskheroes:external/utils");

var chest;
var vampire;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    vampire = renderer.createEffect("fiskheroes:overlay");
    vampire.texture.set("vampire");

    utils.bindTrail(renderer, "emo:exblur");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
    if (renderLayer == "CHESTPLATE") {
        vampire.opacity = entity.getInterpolatedData("emo:dyn/sword_timer");
        vampire.render();
    }
}
