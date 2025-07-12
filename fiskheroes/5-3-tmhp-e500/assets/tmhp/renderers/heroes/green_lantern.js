extend("fiskheroes:hero_basic");
loadTextures({
    "base": "tmhp:dc/lanterns/green/hal_jordan/base",
    "lights": "tmhp:dc/lanterns/green/hal_jordan/lights",
    "suit": "tmhp:dc/lanterns/green/hal_jordan/suit.tx.json",
    "mask": "tmhp:dc/lanterns/green/hal_jordan/mask.tx.json",
    "ring": "tmhp:dc/lanterns/green/ring",
    "hand": "tmhp:dc/lanterns/green/hand",
    "jetpack": "tmhp:dc/lanterns/green/jetpack",

    "null": "tmhp:null",

    "sword": "tmhp:dc/lanterns/green/sword",
    "hammer": "tmhp:dc/lanterns/green/hammer",
    "helmet": "tmhp:dc/lanterns/green/mecha/helmet",
    "helmet_glow": "tmhp:dc/lanterns/green/mecha/helmet_glow",
    "chestplate": "tmhp:dc/lanterns/green/mecha/chestplate",
    "arm": "tmhp:dc/lanterns/green/mecha/arm",
    "leg": "tmhp:dc/lanterns/green/mecha/leg",
    "blaster": "tmhp:dc/lanterns/green/mecha/blaster"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var mantapack = implement("fiskheroes:external/mantapack");

var mask;
var jetpack;
var hand;
var sword;
var hammer;
var helmet;
var chestplate;
var arm;
var leg;
var blaster;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY") && !entity.getData("tmhp:dyn/mecha_timer")) {
            var timer = entity.getInterpolatedData("tmhp:dyn/lantern_timer");
            return timer == 0 ? "ring" : timer < 1 ? "suit" : "base";
        }
        if (!entity.is("DISPLAY")) {
            var timer = entity.getInterpolatedData("tmhp:dyn/mecha_timer");
            return timer == 0 ? "ring" : timer < 1 ? "null" : "null";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        return !entity.is("DISPLAY") && entity.getInterpolatedData("tmhp:dyn/lantern_timer") < 1 ? null : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.setItemIcons("%s_0", "green_ring", "%s_2", "%s_3");
}

function initEffects(renderer) {
    hand = renderer.createEffect("fiskheroes:overlay");
    hand.texture.set(null, "hand");
    mask = renderer.createEffect("fiskheroes:overlay");
    mask.texture.set("mask");

    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "tmhp:sword", null, "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    hammer = renderer.createEffect("fiskheroes:model");
    hammer.setModel(utils.createModel(renderer, "tmhp:hammer", null, "hammer"));
    hammer.anchor.set("rightArm");
    hammer.mirror = false;

    helmet = renderer.createEffect("fiskheroes:model");
    helmet.setModel(utils.createModel(renderer, "tmhp:mecha/helmet", "helmet", "helmet_glow"));
    helmet.anchor.set("head");
    helmet.mirror = false;

    chestplate = renderer.createEffect("fiskheroes:model");
    chestplate.setModel(utils.createModel(renderer, "tmhp:mecha/chestplate", null, "chestplate"));
    chestplate.anchor.set("body");
    chestplate.mirror = false;

    arm = renderer.createEffect("fiskheroes:model");
    arm.setModel(utils.createModel(renderer, "tmhp:mecha/arm", null, "arm"));
    arm.anchor.set("rightArm");
    arm.mirror = true;

    leg = renderer.createEffect("fiskheroes:model");
    leg.setModel(utils.createModel(renderer, "tmhp:mecha/leg", null, "leg"));
    leg.anchor.set("rightLeg");
    leg.mirror = true;

    blaster = renderer.createEffect("fiskheroes:model");
    blaster.setModel(utils.createModel(renderer, "tmhp:mecha/blaster", null, "blaster"));
    blaster.anchor.set("rightArm");
    blaster.mirror = true;

    var green_fire = renderer.createResource("ICON", "elseworld:green_fire_layer_%s");
    jetpack = mantapack.create(renderer, null, "jetpack", green_fire);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x00FF00);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "rightArm", 0x008800, [
        { "firstPerson": [-4.50, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:energy_projection", "rightArm", 0x00FF00, [
        { "firstPerson": [-4.5, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3, 3] },
        { "firstPerson": [3.75, 3.75, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [3, 3], "anchor": "leftArm" }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_antimatter"));

    utils.setOpacityWithData(renderer, 0.9, 1.0, "tmhp:dyn/mecha");
    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");

    shrink_lights = body_lines.create(renderer, "tmhp:df_steady_beam", 0x00FF00, [
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
    addAnimation(renderer, "basic.BLOCKING", "fiskheroes:aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"), entity.getData("fiskheroes:shield_blocking") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });

    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/default_arms_forward.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/neutral");
    addAnimationWithData(renderer, "iron_man.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "lantern_sword.SWORD_POSE", "fiskheroes:sword_pose", "fiskheroes:blade_timer");
    addAnimationWithData(renderer, "lantern_hammer.SWORD_POSE", "fiskheroes:sword_pose", "fiskheroes:dyn/steel_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        mask.opacity = entity.getInterpolatedData("fiskheroes:mask_open_timer");
        mask.render();
        hand.opacity = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        hand.render();
        sword.opacity = entity.getInterpolatedData("fiskheroes:blade");
        sword.render();
        hammer.opacity = entity.getInterpolatedData("fiskheroes:dyn/steeled");
        hammer.render();


        helmet.opacity = entity.getInterpolatedData("tmhp:dyn/mecha");
        helmet.render();
        chestplate.opacity = entity.getInterpolatedData("tmhp:dyn/mecha");
        chestplate.render();
        arm.opacity = entity.getInterpolatedData("tmhp:dyn/mecha");
        arm.render();
        leg.opacity = entity.getInterpolatedData("tmhp:dyn/mecha");
        leg.render();
        blaster.opacity = entity.getInterpolatedData("fiskheroes:beam_charging");
        blaster.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE" && !entity.getInterpolatedData("tmhp:dyn/mecha")) {
        shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("tmhp:dyn/lantern_timer");
        shrink_lights.progress /= Math.sqrt(entity.getData('tmhp:dyn/lantern_timer') > 0) * 2;
        shrink_lights.render(renderLayer);
    }
    if (entity.getData("fiskheroes:dyn/nanites")) {
        jetpack.render(entity);
    }
}