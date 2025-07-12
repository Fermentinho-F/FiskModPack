extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:phantoms/danny/dark_danny_layer1",
    "layer2": "tmhp:phantoms/danny/dark_danny_layer2",
    "phantom_eyes": "tmhp:phantoms/danny/phantom_eye_red",
    "phantom_hands": "tmhp:phantoms/phantom_hands",
    "cape": "tmhp:phantoms/danny/dark_danny_cape"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var cape;
var phantom_hands;
var phantom_eyes;

function init(renderer) {
    parent.init(renderer);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.AIMING");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_hand_beam").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/neutral");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}
function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    phantom_hands = renderer.createEffect("fiskheroes:overlay");
    phantom_hands.texture.set(null, "phantom_hands");

    phantom_eyes = renderer.createEffect("fiskheroes:overlay");
    phantom_eyes.texture.set(null, "phantom_eyes");

    utils.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:intangibility_timer");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "body", 0x119911, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        phantom_hands.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        phantom_hands.render();
    }
    if (renderLayer == "CHESTPLATE") {
        phantom_eyes.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
}