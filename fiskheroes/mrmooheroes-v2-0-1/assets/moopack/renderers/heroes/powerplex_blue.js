extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:powerplex/powerplex_blue_layer1",
    "layer2": "moopack:powerplex/powerplex_blue_layer2",
    "layer1_lights": "moopack:powerplex/powerplex_lights",
    "layer2_lights": "moopack:powerplex/powerplex_lights2",
    "visor": "moopack:powerplex/powerplex_visor"
});

var utils = implement("fiskheroes:external/utils");

var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2_lights" : "layer1_lights");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("visor");

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:mysterio_beam", "body", 0x03F478, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.2, 2, -4.0], "size": [5, 1.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindTrail(renderer, "moopack:okuyasu_trail").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0x03F478, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "lightning.FLIGHT", "fiskheroes:flight/propelled_hands.anim.json");
    utils.addHoverAnimation(renderer, "lightning.HOVER", "fiskheroes:flight/idle/propelled_hands");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "HELMET") {
        overlay.opacity = 1 - 0.7 * entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        overlay.render();
    }
}