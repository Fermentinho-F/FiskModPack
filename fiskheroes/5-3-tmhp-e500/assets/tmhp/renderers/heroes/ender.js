extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:custom/ender_layer1",
    "layer2": "tmhp:custom/ender_layer2"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0xFF33FF, [
        { "firstPerson": [2.2, 0.0, 2.0], "offset": [2.2, -3.3, -4.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.2, 0.0, 2.0], "offset": [-2.2, -3.3, -4.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFF33FF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xFF33FF);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addHoverAnimation(renderer, "strange.HOVER", "fiskheroes:flight/idle/neutral");
    utils.addFlightAnimation(renderer, "strange.FLIGHT", "fiskheroes:flight/levitate.anim.json", (entity, data) => {
        data.load(entity.getInterpolatedData("fiskheroes:flight_timer"));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();
}
