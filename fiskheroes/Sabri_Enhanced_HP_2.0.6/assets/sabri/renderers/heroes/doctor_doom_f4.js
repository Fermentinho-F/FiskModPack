extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:doctor_doom_f4_layer1",
    "layer2": "sabri:doctor_doom_f4_layer2",
    "chest": "sabri:doctor_doom_f4_chest"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => renderLayer == "CHESTPLATE" ? "chest" : renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}


function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "sabri:doctor_doom_f4_beam", "rightArm", 0x2340A8, [
        { "firstPerson": [-5.5, 4.75, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [5.0, 5.0, -5.0] },
        { "firstPerson": [5.5, 4.75, -10.0], "offset": [0.5, 9.0, 0.0], "size": [5.0, 5.0, -5.0], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0x2340A8, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);

    arms_blast = utils.createLines(renderer, "sabri:doctor_doom_f4_charge", 0x2340A8, [
        {"start": [0.0, -0.015, 0.0], "end": [0.0, -0.3, 0.0], "size": [4.8, 2.45]},
        {"start": [0.1575, -0.015, -0.065], "end": [0.1575, -0.3, -0.065], "size": [2.5, 1.25]}
    ]);
    arms_blast.anchor.set("rightArm");
    arms_blast.setOffset(2.0, 10.25, 0.0).setScale(16.0, 12.0, 16.0);
    arms_blast.mirror = true;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "basic.CHARGED_BEAM", "fiskheroes:dual_aiming").setData((entity, data) => 
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 2.5 - 1.5, 0)));
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        arms_blast.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        arms_blast.render();
    }
}