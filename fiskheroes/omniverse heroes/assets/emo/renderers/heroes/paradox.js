extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:paradox",
    "layer2": "emo:paradox"
});

var utils = implement("fiskheroes:external/utils");

var glow;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0xFFFFFF);

    utils.bindParticles(renderer, "fiskheroes:harbinger_glow");
    utils.bindTrail(renderer, "emo:blur");
}

function render(entity) {
    glow.opacity = entity.getInterpolatedData("fiskheroes:teleport_timer");
    glow.render();
}
