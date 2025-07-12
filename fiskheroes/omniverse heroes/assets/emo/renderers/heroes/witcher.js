extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:witcher",
    "layer2": "emo:witcher",
    "sword": "emo:silver",
});

var utils = implement("fiskheroes:external/utils");

var sword;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "emo:sword", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    utils.bindTrail(renderer, "emo:exblur");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "emo:invisible_beam", "rightArm", 0xD3D3D3, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [5.0, 5.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "witcher.CHARGED_BEAM", "fiskheroes:aiming", "fiskheroes:beam_charge");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        sword.opacity = entity.getInterpolatedData("fiskheroes:shield");
        sword.render();
    }
}
