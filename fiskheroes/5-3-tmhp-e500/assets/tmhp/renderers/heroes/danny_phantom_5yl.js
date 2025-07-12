extend("fiskheroes:hero_basic");
loadTextures({
    "suit":   "tmhp:phantoms/danny/danny_5yl_suit.tx.json",
    "base":   "tmhp:phantoms/danny/danny_phantom_5yl_base",
    "phantom_eyes": "tmhp:phantoms/danny/phantom_eye.tx.json",
    "phantom_transform": "tmhp:phantoms/phantom_transform.tx.json",
    "ice_hands": "tmhp:phantoms/ice_hands",
    "phantom_hands": "tmhp:phantoms/phantom_hand_5yl",

    "null": "tmhp:null",
    "belt": "tmhp:phantoms/danny/belt",
    "belt_glow": "tmhp:phantoms/danny/belt_glow",
    "spectre_slicer": "tmhp:phantoms/danny/belt_sword",
    "spectre_slicer_glow": "tmhp:phantoms/danny/belt_sword_glow",
    "phantom_flame": "tmhp:phantoms/danny/5yl_phantom_flame",
    "intangibility": "tmhp:phantoms/danny/5yl_intangibility"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");

var ice_hands;
var phantom_hands;
var phantom_eyes;
var phantom_transform;

var phantom_flame;
var intangibility;
var belt;
var spectre_slicer;

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

    ice_hands = renderer.createEffect("fiskheroes:overlay");
    ice_hands.texture.set(null, "ice_hands");
    phantom_hands = renderer.createEffect("fiskheroes:overlay");
    phantom_hands.texture.set(null, "phantom_hands");
    phantom_eyes = renderer.createEffect("fiskheroes:overlay");
    phantom_eyes.texture.set(null, "phantom_eyes");

    phantom_flame = renderer.createEffect("fiskheroes:overlay");
    phantom_flame.texture.set(null, "phantom_flame");
    intangibility = renderer.createEffect("fiskheroes:overlay");
    intangibility.texture.set(null, "intangibility");
    belt = renderer.createEffect("fiskheroes:overlay");
    belt.texture.set("belt", "belt_glow");

    spectre_slicer = renderer.createEffect("fiskheroes:model");
    spectre_slicer.setModel(utils.createModel(renderer, "tmhp:belt_sword", "spectre_slicer", "spectre_slicer_glow"));
    spectre_slicer.anchor.set("rightArm");
    spectre_slicer.mirror = false;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x00FF00);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.setOpacityWithData(renderer, 0.9, 1.0, "fiskheroes:intangibility_timer");

    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "rightArm", 0x119911, [
        { "firstPerson": [-4.50, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam", "body", 0x00FF00, [
        { "firstPerson": [0.0, 6.0, 0.0], "offset": [0.0, 5.0, -4.0], "size": [6.0, 6.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));

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
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "basic.ENERGY_PROJ", "fiskheroes:aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:energy_projection") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimation(renderer, "basic.AIMING", "fiskheroes:dual_aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:beam_charge");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:beam_charging") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimation(renderer, "basic.BLOCKING", "tmhp:zoro_block").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"), entity.getData("fiskheroes:shield_blocking") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimationWithData(renderer, "danny.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:blade_timer");

    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/neutral");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;
}

function render(entity, renderLayer, isFirstPersonArm) {
        phantom_hands.opacity = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        phantom_hands.render();
        phantom_eyes.opacity = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
        phantom_eyes.render();
        ice_hands.opacity = entity.getInterpolatedData("fiskheroes:cryo_charge");
        ice_hands.render();
        phantom_flame.opacity = entity.getInterpolatedData("fiskheroes:beam_charge");
        phantom_flame.render();
        intangibility.opacity = entity.getInterpolatedData("fiskheroes:intangibility_timer");
        intangibility.render();
        belt.opacity = !entity.getInterpolatedData("fiskheroes:blade") && entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
        belt.render();
        spectre_slicer.opacity = entity.getInterpolatedData("fiskheroes:blade");
        spectre_slicer.render();

        phantom_transform.opacity = entity.getInterpolatedData("tmhp:dyn/ghostform_timer") > 0 && entity.getInterpolatedData("tmhp:dyn/ghostform_timer") < 1;
        phantom_transform.render();
    if (!isFirstPersonArm) {
        shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("tmhp:dyn/ghostform_timer");
        shrink_lights.progress /= Math.sqrt(entity.getData('tmhp:dyn/ghostform_timer') > 0) * 2;
        shrink_lights.render(renderLayer);
    }
}