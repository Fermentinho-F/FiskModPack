extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:exo2",
    "layer2": "emo:exo2",
    "layer1_lights": "emo:exo_lights2",
    "layer2_lights": "emo:exo_lights2"
});

var utils = implement("fiskheroes:external/utils");

var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("visor");

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "emo:asa");
    utils.bindCloud(renderer, "fiskheroes:teleportation", "emo:asa");
    utils.bindParticles(renderer, "fiskheroes:black_lightning").setCondition(entity => entity.getData("fiskheroes:flying"));
    utils.bindTrail(renderer, "emo:blur_black");
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0x0049FF, [
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
