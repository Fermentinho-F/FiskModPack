extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:wick",
    "layer2": "emo:wick",
    "kalem": "emo:kalem"
});

var utils = implement("fiskheroes:external/utils");

var kalem;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    kalem = renderer.createEffect("fiskheroes:model");
    kalem.setModel(utils.createModel(renderer, "emo:kalem", "kalem"));
    kalem.anchor.set("rightArm");
    kalem.mirror = false;

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        kalem.opacity = entity.getInterpolatedData("fiskheroes:blade");
        kalem.render();
    }
}