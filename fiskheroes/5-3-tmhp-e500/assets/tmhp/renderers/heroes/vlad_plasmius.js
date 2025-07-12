extend("tmhp:hero_phantom");
loadTextures({
    "suit":   "tmhp:phantoms/vlad/plasmius_suit.tx.json",
    "base":   "tmhp:phantoms/vlad/plasmius_base",
    "phantom_transform": "tmhp:phantoms/phantom_transform_black.tx.json",
    "phantom_eyes": "tmhp:phantoms/vlad/phantom_eye_vlad.tx.json",
    "phantom_hands": "tmhp:phantoms/phantom_hands_vlad",
    "cape": "tmhp:phantoms/vlad/plasmius_cape.tx.json"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var collar;
var cape;
var phantom_hands;
var phantom_eyes;
var phantom_transform;

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/neutral");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}
function initEffects(renderer) {
    phantom_transform = renderer.createEffect("fiskheroes:model");
    phantom_transform.setModel(utils.createModel(renderer, "tmhp:phantom_transform", null, "phantom_transform"));

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    phantom_hands = renderer.createEffect("fiskheroes:overlay");
    phantom_hands.texture.set(null, "phantom_hands");

    phantom_eyes = renderer.createEffect("fiskheroes:overlay");
    phantom_eyes.texture.set(null, "phantom_eyes");

    collar = renderer.createEffect("fiskheroes:ears");
    collar.anchor.set("head");
    collar.angle = -7;
    collar.inset = -0.065;

    utils.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:intangibility_timer");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "body", 0x980182, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        phantom_hands.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        phantom_hands.render();
    }
    if (renderLayer == "CHESTPLATE") {
        phantom_eyes.opacity = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
        phantom_eyes.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" || entity.is("DISPLAY")) {
        cape.render(entity);
        collar.render();
    }
        phantom_transform.opacity = entity.getInterpolatedData("tmhp:dyn/ghostform_timer") > 0 && entity.getInterpolatedData("tmhp:dyn/ghostform_timer") < 1;
        phantom_transform.render();
}