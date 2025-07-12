extend("fiskheroes:hero_basic");
loadTextures({
    "base": "tmhp:dc/lanterns/blue/razer/base",
    "lights": "tmhp:dc/lanterns/blue/razer/lights",
    "suit": "tmhp:dc/lanterns/blue/razer/suit.tx.json",
    "mask": "tmhp:dc/lanterns/blue/razer/mask.tx.json",
    "ring": "tmhp:dc/lanterns/blue/ring",
    "hand": "tmhp:dc/lanterns/blue/hand",
    "jetpack": "tmhp:dc/lanterns/blue/jetpack",

    "rapier": "tmhp:dc/lanterns/blue/rapier",
    "hammer": "tmhp:dc/lanterns/blue/hammer"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var mantapack = implement("fiskheroes:external/mantapack");

var jetpack;
var hand;
var rapier;
var hammer;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (entity.getData("fiskheroes:mask_open_timer2") > 0) {
            return "mask";
        }
        else if (!entity.is("DISPLAY")) {
            var timer = entity.getInterpolatedData("tmhp:dyn/lantern_timer");
            return timer == 0 ? "ring" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        return !entity.is("DISPLAY") && entity.getInterpolatedData("tmhp:dyn/lantern_timer") < 1 ? null : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.setItemIcons("%s_0", "blue_ring", "%s_2", "%s_3");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    hand = renderer.createEffect("fiskheroes:overlay");
    hand.texture.set(null, "hand");

    rapier = renderer.createEffect("fiskheroes:model");
    rapier.setModel(utils.createModel(renderer, "tmhp:rapier", null, "rapier"));
    rapier.anchor.set("rightArm");
    rapier.mirror = false;

    hammer = renderer.createEffect("fiskheroes:model");
    hammer.setModel(utils.createModel(renderer, "tmhp:hammer", null, "hammer"));
    hammer.anchor.set("rightArm");
    hammer.mirror = false;

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0x0000FF);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:heal_beam", "rightArm", 0x0000FF, [
        { "firstPerson": [-3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [3.0, 3.0] }
    ]);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");

    var blue_fire = renderer.createResource("ICON", "fiskheroes:deep_blue_fire_layer_%s");
    jetpack = mantapack.create(renderer, null, "jetpack", blue_fire);

    shrink_lights = body_lines.create(renderer, "tmhp:df_steady_beam", 0x0000FF, [
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
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming").setData((entity, data) => {
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
        hand.opacity = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        hand.render();
        rapier.opacity = entity.getInterpolatedData("fiskheroes:blade");
        rapier.render();
        hammer.opacity = entity.getInterpolatedData("fiskheroes:dyn/steeled");
        hammer.render();
    }
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("tmhp:dyn/lantern_timer");
        shrink_lights.progress /= Math.sqrt(entity.getData('tmhp:dyn/lantern_timer') > 0) * 2;
        shrink_lights.render(renderLayer);
    }
    if (entity.getData("fiskheroes:dyn/nanites")) {
        jetpack.render(entity);
    }
}