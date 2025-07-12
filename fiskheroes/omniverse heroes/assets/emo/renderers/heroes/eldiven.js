extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "eldiven": "emo:eldiven"
});

var utils = implement("fiskheroes:external/utils");

var eldiven;

function initEffects(renderer) {
    eldiven = renderer.createEffect("fiskheroes:model");
    eldiven.setModel(utils.createModel(renderer, "emo:eldiven", "eldiven"));
    eldiven.anchor.set("rightArm");
    eldiven.mirror = false;

    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:bf");
    utils.bindTrail(renderer, "emo:blur");

    // charged beam
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0xAA00FF, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
}


function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        eldiven.render();
    }
}
