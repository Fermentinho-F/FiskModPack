extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:power",
    "layer2": "emo:power",
    "sword": "emo:powerred",
    "punch": "emo:powerred"    
});

var utils = implement("fiskheroes:external/utils");

var sword;
var punch;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:powerhammer", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    punch = renderer.createEffect("fiskheroes:model");
    punch.setModel(utils.createModel(renderer, "emo:powerblade", "punch"));
    punch.anchor.set("rightArm");
    punch.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        sword.opacity = entity.getInterpolatedData("fiskheroes:shield");
        sword.render();

       punch.opacity = entity.getInterpolatedData("fiskheroes:blade");
       punch.render();
    }
}