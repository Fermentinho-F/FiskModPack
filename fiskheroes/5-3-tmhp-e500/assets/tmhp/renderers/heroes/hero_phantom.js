extend("fiskheroes:hero_basic");
loadTextures({
    "null": "tmhp:null",
    "phantom_transform": "tmhp:phantoms/phantom_transform.tx.json",
    "phantom_eyes": "tmhp:phantoms/danny/phantom_eye.tx.json",
    "phantom_hands": "tmhp:phantoms/phantom_hands"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");

var phantom_hands;
var phantom_eyes;
var phantom_transform;

function init(renderer) {
    parent.init(renderer);

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");

    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY") && renderLayer == "CHESTPLATE") {
            var timer = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
            return timer == 0 ? "null" : timer < 1 ? "suit" : "base";
        }
        else if (!entity.is("DISPLAY") && renderLayer == "LEGGINGS") {
            var timer = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
            return timer == 0 ? "null" : timer < 1 ? "suit" : "base";
        }
        else if (!entity.is("DISPLAY") && renderLayer == "BOOTS") {
            var timer = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
            return timer == 0 ? "null" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
}

function initEffects(renderer) {
    phantom_transform = renderer.createEffect("fiskheroes:model");
    phantom_transform.setModel(utils.createModel(renderer, "tmhp:phantom_transform", null, "phantom_transform"));

    phantom_hands = renderer.createEffect("fiskheroes:overlay");
    phantom_hands.texture.set(null, "phantom_hands");

    phantom_eyes = renderer.createEffect("fiskheroes:overlay");
    phantom_eyes.texture.set(null, "phantom_eyes");

    utils.setOpacityWithData(renderer, 0.5, 1.0, "fiskheroes:intangibility_timer");
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "body", 0x119911, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    shrink_lights = body_lines.create(renderer, "tmhp:df_steady_beam", 0x111111, [
        { anchor: "head", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [0.0, 0.1, 0.0], "end": [0.0, -18.8, 0.0], "size": [6.9, 6.9] }
        ]},
        { anchor: "leftArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [1.0, -2.8, 0.0], "end": [0.0, 23.8, 0.0], "size": [2.9, 2.9] }
        ]},
        { anchor: "rightArm", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-1.0, -2.8, 0.0], "end": [0.0, 23.8, 0.0], "size": [2.9, 2.9] }
        ]},
        { anchor: "leftLeg", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [1.0, -0.8, 0.0], "end": [0.0, 25.8, 0.0], "size": [2.9, 2.9] }
        ]},
        { anchor: "rightLeg", renderLayer: "CHESTPLATE", mirror: false, entries: [
            { "start": [-1.0, -0.8, 0.0], "end": [0.0, 25.8, 0.0], "size": [2.9, 2.9] }
        ]}
    ]);
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

function render(entity, renderLayer, isFirstPersonArm) {
        phantom_hands.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        phantom_hands.render();
        phantom_eyes.opacity = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
        phantom_eyes.render();
        phantom_transform.opacity = entity.getInterpolatedData("tmhp:dyn/ghostform_timer") > 0 && entity.getInterpolatedData("tmhp:dyn/ghostform_timer") < 1;
        phantom_transform.render();
    if (!isFirstPersonArm) {
        shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
        shrink_lights.progress /= Math.sqrt(entity.getData('tmhp:dyn/ghostform_timer') > 0) * 2;
        shrink_lights.render(renderLayer);
    }
}