extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:odin",
    "layer2": "emo:odin",
    "asa": "emo:savage_wand"
});

var utils = implement("fiskheroes:external/utils");

var asa;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    asa = renderer.createEffect("fiskheroes:model");
    asa.setModel(utils.createModel(renderer, "emo:gungnir", "asa"));
    asa.anchor.set("rightArm");
    asa.mirror = false;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x1100FF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:pariah");
    utils.bindCloud(renderer, "fiskheroes:telekinesis", "emo:pariah");

      // charged beam
      utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "rightArm", 0xFF4D00, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, -8.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        asa.opacity = entity.getInterpolatedData("fiskheroes:shield");
        asa.render();
    }
}
