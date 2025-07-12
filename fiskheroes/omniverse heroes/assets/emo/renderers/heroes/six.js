extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:six",
    "layer2": "emo:six",
    "sword": "emo:sixsword",
    "sword2": "emo:sixsword"
});

var utils = implement("fiskheroes:external/utils");

var sword;
var sword2;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:sixsword", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    sword2 = renderer.createEffect("fiskheroes:model");
    sword2.setModel(utils.createModel(renderer, "emo:sixsword", "sword2"));
    sword2.anchor.set("leftArm");
    sword2.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        sword.opacity = entity.getInterpolatedData("fiskheroes:shield");
        sword.render();

        sword2.opacity = entity.getInterpolatedData("fiskheroes:shield");
        sword2.render();
    }
}
