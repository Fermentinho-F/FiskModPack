extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "sword": "emo:deathnote",
    "ryuk": "emo:ryuk"
});

var utils = implement("fiskheroes:external/utils");

var sword;
var ryuk;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:deathnote", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    ryuk = renderer.createEffect("fiskheroes:model");
    ryuk.setModel(utils.createModel(renderer, "emo:ryuk", "ryuk"));
    ryuk.anchor.set("body");
    ryuk.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:heat_vision", "emo:yok", "rightArm", 0xFF0000, [
        { "firstPerson": [-4.30, 10.20, -0.10], "offset": [-4.30, 10.20, -0.10], "size": [1.0, 0.5] },
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "mando.HEAT_VISION", "fiskheroes:aiming", "fiskheroes:heat_vision");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        sword.opacity = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
        sword.render();
    }
    if (renderLayer == "CHESTPLATE") {
        ryuk.render();
    }
}