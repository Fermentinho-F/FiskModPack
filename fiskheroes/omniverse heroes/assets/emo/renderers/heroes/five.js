extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:five",
    "layer2": "emo:five"
});

var utils = implement("fiskheroes:external/utils");

var glow;

function initEffects(renderer) {
    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xE0F5FF);

    utils.bindParticles(renderer, "fiskheroes:harbinger_glow");
}

function render(entity) {
    glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();
}
