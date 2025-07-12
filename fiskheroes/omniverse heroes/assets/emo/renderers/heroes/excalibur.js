extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "sword": "emo:excalibur"
});

var utils = implement("fiskheroes:external/utils");

var sword;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE" && !entity.getData("fiskheroes:mask_open_timer2")) {
            return "layer1";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.fixHatLayer("CHESTPLATE");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:sword", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    utils.bindTrail(renderer, "emo:exblur");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        sword.opacity = entity.getInterpolatedData("fiskheroes:shield");
        sword.render();
    }
}
