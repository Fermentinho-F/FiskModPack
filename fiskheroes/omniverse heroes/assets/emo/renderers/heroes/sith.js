extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "saber": "emo:red_saber"   
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
    saber.setModel(utils.createModel(renderer, "emo:red_saber", "saber"));
    saber.anchor.set("rightArm");
    saber.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "emo:yok", "body", 0xFBFF00, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        saber.opacity = entity.getInterpolatedData("fiskheroes:blade");
        saber.render();
    }
}