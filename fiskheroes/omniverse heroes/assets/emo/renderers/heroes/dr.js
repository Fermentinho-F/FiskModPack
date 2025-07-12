extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:dr",
    "layer2": "emo:dr"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:intangibility_timer");

    // charged beam
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "emo:invisible_beam", "rightArm", 0xD3D3D3, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");
    utils.addHoverAnimation(renderer, "strange.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "strange.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:bf");
}
