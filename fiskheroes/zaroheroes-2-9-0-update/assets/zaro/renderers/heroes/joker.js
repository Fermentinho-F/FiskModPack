extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:joker",
    "layer2": "zaro:joker"
});

var utils = implement("fiskheroes:external/utils");



function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] }
    ]);

    utils.bindTrail(renderer, "fiskheroes:shazam");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "zaro:null", "rightArm", 0x41acbf, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "zaro:joker_smoke"));

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x6EFF00);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-3.5, 2.0, 3.0], "rotation": [0.0, -90.0, 60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 3.0);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimationWithData(renderer, "antimonitor.ANTIBLAST", "fiskheroes:dual_aiming", "fiskheroes:beam_charge");
}