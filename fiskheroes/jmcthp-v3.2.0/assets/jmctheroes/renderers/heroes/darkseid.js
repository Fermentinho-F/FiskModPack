extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:darkseid/darkseid_layer1",
    "layer2": "jmctheroes:darkseid/darkseid_layer2",
    "lights": "jmctheroes:darkseid/darkseid_lights"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? null : "lights");
}

function initEffects(renderer) {
    utils.bindParticles(renderer, "fiskheroes:black_manta_dceu_eyes").setCondition(entity => entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") < 1);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:invisible", "head", 0x000000, [
        {"firstPerson": [0.0, 6.0, 0.0],"offset": [0.0, 5.0, -4.0],"size": [4.0, 4.0]}
    ]).setCondition(entity => entity.getData("jmctheroes:dyn/random_charge") == 0);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:omega_beam1", "head", 0xFF0000, [
        {"firstPerson": [2.2, 0.0, 2.0],"offset": [2.2, -3.3, -4.0],"size": [1.0, 0.5]},
        {"firstPerson": [-2.2, 0.0, 2.0],"offset": [-2.2, -3.3, -4.0],"size": [1.0, 0.5]}
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("jmctheroes:dyn/random_charge") == 1);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:omega_beam2", "head", 0xFF0000, [
        {"firstPerson": [2.2, 0.0, 2.0],"offset": [2.2, -3.3, -4.0],"size": [1.0, 0.5]},
        {"firstPerson": [-2.2, 0.0, 2.0],"offset": [-2.2, -3.3, -4.0],"size": [1.0, 0.5]}
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("jmctheroes:dyn/random_charge") == 2);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:omega_beam3", "head", 0xFF0000, [{
        "firstPerson": [2.2, 0.0, 2.0],"offset": [2.2, -3.3, -4.0],"size": [1.0, 0.5]},
        {"firstPerson": [-2.2, 0.0, 2.0],"offset": [-2.2, -3.3, -4.0],"size": [1.0, 0.5]}
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection")).setCondition(entity => entity.getData("jmctheroes:dyn/random_charge") == 3);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimation(renderer, "omega.FLIGHT", "jmctheroes:flight/hover/power_hover").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}
