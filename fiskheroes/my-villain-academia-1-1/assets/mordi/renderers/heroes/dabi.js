extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "mordi:dabi_layer1",
    "layer2": "mordi:dabi_layer1",

    "fire": "mordi:fire_particles",
});

var utils = implement("fiskheroes:external/utils");
var flames = implement("fiskheroes:external/flames");

var eyes;
var hand_flames;
var head_flames;


function initEffects(renderer) {
    eyes = renderer.createEffect("fiskheroes:overlay");
    eyes.texture.set("eyes");

    var fire = renderer.createResource("ICON", "mordi:blue_fire_layer_%s");
    hand_flames = flames.createHands(renderer, fire, true);
    head_flames = flames.createHead(renderer, fire);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");
    utils.bindParticles(renderer, "fiskheroes:black_lightning").setCondition(entity => entity.getData("fiskheroes:flying"));
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "firestorm.FLIGHT", "fiskheroes:flight/propelled_hands.anim.json");
    utils.addHoverAnimation(renderer, "firestorm.HOVER", "fiskheroes:flight/idle/propelled_hands");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" && entity.isWearingFullSuit()) {
        if (!isFirstPersonArm && (!entity.is("DISPLAY") || entity.as("DISPLAY").isSkinShown())) {
            eyes.render();
        }
        if (!entity.is("DISPLAY") || !entity.as("DISPLAY").isStatic()) {
            hand_flames.render(1);
            if (!isFirstPersonArm) {
                head_flames.render(1 - entity.getInterpolatedData("fiskheroes:mask_open_timer2"));
            }
        }
    }
}
