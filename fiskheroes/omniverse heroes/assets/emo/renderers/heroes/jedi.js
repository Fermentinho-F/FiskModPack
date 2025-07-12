extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "saber": "emo:blue_saber"   
});

var utils = implement("fiskheroes:external/utils");

var saber;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    saber = renderer.createEffect("fiskheroes:model");
    saber.setModel(utils.createModel(renderer, "emo:blue_saber", "saber"));
    saber.anchor.set("rightArm");
    saber.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        saber.opacity = entity.getInterpolatedData("fiskheroes:blade");
        saber.render();
    }
}