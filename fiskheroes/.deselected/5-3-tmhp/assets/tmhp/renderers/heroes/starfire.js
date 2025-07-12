extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/teen_titans/starfire/layer1",
    "layer2": "tmhp:dc/teen_titans/starfire/layer2",
    "eyes": "tmhp:dc/teen_titans/starfire/eyes"
});

var utils = implement("fiskheroes:external/utils");

var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");
    }
function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set(null, "eyes");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "head", 0x00FF00, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [4.0, 4.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:cold_beam", "head", 0x00FF00, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 1.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 1.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "mm.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
    .priority = -8;
    utils.addHoverAnimation(renderer, "mm.HOVER", "fiskheroes:flight/idle/neutral");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        overlay.opacity = entity.getInterpolatedData("fiskheroes:beam_charging");
        overlay.render();
    }
}