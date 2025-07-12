extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:dna/dna_base"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {    
    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x1193D4);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "fiskheroes:telekinesis_monitor");

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "rightArm", 0x1193D4, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [1.5, 1.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_charged_beam"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimationWithData(renderer, "power.CHHARGED_BEAM", "fiskheroes:aiming_fpcorr", "fiskheroes:beam_charge");
}
