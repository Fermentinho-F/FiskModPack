extend("fiskheroes:hero_basic");
loadTextures({
    "base": "tmhp:dc/lanterns/yellow/sinestro/base",
    "lights": "tmhp:dc/lanterns/yellow/sinestro/lights",
    "suit": "tmhp:dc/lanterns/yellow/sinestro/suit.tx.json",
    "ring": "tmhp:dc/lanterns/yellow/ring",
    "hand": "tmhp:dc/lanterns/yellow/hand",
    "jetpack": "tmhp:dc/lanterns/yellow/jetpack",

    "sword": "tmhp:dc/lanterns/yellow/sword",
    "scythe": "tmhp:dc/lanterns/yellow/scythe"
});

var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var mantapack = implement("fiskheroes:external/mantapack");

var jetpack;
var hand;
var sword;
var scythe;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY")) {
            var timer = entity.getInterpolatedData("tmhp:dyn/lantern_timer");
            return timer == 0 ? "ring" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        return !entity.is("DISPLAY") && entity.getInterpolatedData("tmhp:dyn/lantern_timer") < 1 ? null : "lights";
    });

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.setItemIcons("%s_0", "yellow_ring", "%s_2", "%s_3");
}

function initEffects(renderer) {
    hand = renderer.createEffect("fiskheroes:overlay");
    hand.texture.set(null, "hand");

    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "tmhp:sword", null, "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    scythe = renderer.createEffect("fiskheroes:model");
    scythe.setModel(utils.createModel(renderer, "tmhp:scythe", null, "scythe"));
    scythe.anchor.set("rightArm");
    scythe.mirror = false;

    var yellow_fire = renderer.createResource("ICON", "elseworld:yellow_fire_layer_%s");
    jetpack = mantapack.create(renderer, null, "jetpack", yellow_fire);

    var forcefield = renderer.bindProperty("fiskheroes:forcefield");
    forcefield.color.set(0xFF8800);
    forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
    forcefield.setCondition(entity => {
        forcefield.opacity = entity.getInterpolatedData("fiskheroes:shield_blocking_timer") * 0.15;
        return true;
    });

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:energy_projection", "rightArm", 0xFF8800, [
        { "firstPerson": [-4.50, 3.75, -8.0], "offset": [-0.5, 9.0, 0.0], "size": [3.0, 3.0] }
    ]);

    utils.addCameraShake(renderer, 0.015, 1.5, "fiskheroes:flight_boost_timer");

    shrink_lights = body_lines.create(renderer, "tmhp:df_steady_beam", 0xFF8800, [
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
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "basic.ENERGY_PROJ", "fiskheroes:aiming").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:energy_projection_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:aiming_timer"), entity.getData("fiskheroes:energy_projection") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
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
        sword.opacity = entity.getInterpolatedData("fiskheroes:blade");
        sword.render();
        scythe.opacity = entity.getInterpolatedData("fiskheroes:dyn/steeled");
        scythe.render();
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