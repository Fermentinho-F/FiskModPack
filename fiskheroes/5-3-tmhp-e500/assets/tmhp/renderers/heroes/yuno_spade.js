extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:black_clover/yuno/spade_layer1",
    "layer2": "tmhp:black_clover/yuno/spade_layer2",
    "cape": "tmhp:black_clover/yuno/spade_cape",
    "cape_glow": "tmhp:black_clover/yuno/spade_cape_glow.tx.json",

    "wind_spirit": "tmhp:black_clover/yuno/bell",
    "spiritdive": "tmhp:black_clover/yuno/spiritdive_spade",
    "crown": "tmhp:black_clover/yuno/spirit_crown",
    "wing": "tmhp:black_clover/yuno/wings",

    "grimoire": "tmhp:black_clover/yuno/grimoire",

    "spirit_of_zephyr": "tmhp:black_clover/yuno/spirit_of_zephyr",
    "spirit_of_boreas": "tmhp:black_clover/yuno/spirit_of_boreas",
    "spirit_of_eurus": "tmhp:black_clover/yuno/spirit_of_eurus"
});

var capes = implement("fiskheroes:external/capes");
var utils = implement("fiskheroes:external/utils");
var body_lines = implement("fiskheroes:external/body_lines");
var spirit_wings = implement("tmhp:external/spirit_wings");
var spiritdive;
var wing;
var wind_spirit;
var crown;
var spirit_of_zephyr;
var spirit_of_boreas;
var spirit_of_eurus;
var grimoire;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.99;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape", "cape_glow");

    grimoire = renderer.createEffect("fiskheroes:model");
    grimoire.setModel(utils.createModel(renderer, "tmhp:black_clover/grimoire", "grimoire"));
    grimoire.anchor.set("body");
    grimoire.mirror = false;

    spiritdive = renderer.createEffect("fiskheroes:overlay");
    spiritdive.texture.set(null, "spiritdive");
    wing = spirit_wings.create(renderer, null, "wing", spirit_wings.SPIRITDIVE2);
    wind_spirit = renderer.createEffect("fiskheroes:model");
    wind_spirit.setModel(utils.createModel(renderer, "tmhp:black_clover/wind_spirit", "wind_spirit"));
    wind_spirit.anchor.set("body");
    wind_spirit.mirror = false;
    crown = renderer.createEffect("fiskheroes:model");
    crown.setModel(utils.createModel(renderer, "tmhp:black_clover/spirit_crown2", null, "crown"));
    crown.anchor.set("head");
    crown.mirror = false;

    spirit_of_zephyr = renderer.createEffect("fiskheroes:model");
    spirit_of_zephyr.setModel(utils.createModel(renderer, "tmhp:black_clover/spirit_of_zephyr", null, "spirit_of_zephyr"));
    spirit_of_zephyr.anchor.set("rightArm");
    spirit_of_zephyr.mirror = false; 
    spirit_of_boreas = renderer.createEffect("fiskheroes:model");
    spirit_of_boreas.setModel(utils.createModel(renderer, "tmhp:black_clover/spirit_of_boreas", null, "spirit_of_boreas"));
    spirit_of_boreas.anchor.set("rightArm");
    spirit_of_boreas.mirror = false; 
    spirit_of_eurus = renderer.createEffect("fiskheroes:model");
    spirit_of_eurus.setModel(utils.createModel(renderer, "tmhp:black_clover/spirit_of_eurus", null, "spirit_of_eurus"));
    spirit_of_eurus.anchor.set("rightArm");
    spirit_of_eurus.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:cold_breath", "rightArm", 0x00FF00, [
        { "firstPerson": [0.0, 6.0, -15.0], "offset": [3.0, 2.0, -1.0], "size": [5, 5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "tmhp:rasenshuriken"));

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

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "tmhp:wind", "body", 0xFFFFFF, [
        { "offset": [15.0, 10.0, -3.0], "size": [1.0, 1.2] },
        { "offset": [17.0, 0.5, -3.0], "size": [1.0, 1.2] },
        { "offset": [16.5, -4.5, -3.0], "size": [1.0, 1.2] },
        { "offset": [-15.75, 10.0, 3.0], "size": [1.0, 1.2] },
        { "offset": [-17.0, 0.5, 3.0], "size": [1.0, 1.2] },
        { "offset": [-16.5, -4.5, 3.0], "size": [1.0, 1.2] }
    ]);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimation(renderer, "basic.CHARGED_BEAM", "fiskheroes:aiming").setData((entity, data) => data.load(Math.max(entity.getInterpolatedData("fiskheroes:beam_charge") * 5 - 4, 0)));

    utils.addHoverAnimation(renderer, "falcon.HOVER", "fiskheroes:flight/idle/falcon");
    utils.addFlightAnimation(renderer, "falcon.FLIGHT", "fiskheroes:flight/cap_falcon.anim.json", (entity, data) => {
        data.load(0, entity.getInterpolatedData("fiskheroes:flight_timer"));
        data.load(1, entity.getInterpolatedData("fiskheroes:flight_boost_timer"));
        data.load(3, entity.getHeldItem().name() == "fiskheroes:captain_americas_shield" && !entity.as("PLAYER").isBlocking() ? entity.getInterpolatedData("fiskheroes:dyn/wing_timer") : 0);
    });
    utils.addAnimationEvent(renderer, "FLIGHT_DIVE", "fiskheroes:iron_man_dive");

    addAnimationWithData(renderer, "iron_man.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;

    addAnimationWithData(renderer, "spirit_of_zephyr.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:shield_timer");
    addAnimationWithData(renderer, "spirit_of_boreas.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:blade_timer");
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
        grimoire.opacity = entity.getInterpolatedData("tmhp:dyn/grimoire_timer");
        grimoire.render();
        spiritdive.opacity = entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer");
        spiritdive.render();
        crown.opacity = entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer");
        crown.render();
        wind_spirit.opacity = !entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer");
        wind_spirit.render();
        spirit_of_zephyr.opacity = entity.getData("fiskheroes:shield_timer");
        spirit_of_zephyr.render();
        spirit_of_boreas.opacity = entity.getData("fiskheroes:blade_timer");
        spirit_of_boreas.render();
        spirit_of_eurus.opacity = entity.getData("fiskheroes:beam_charging");
        spirit_of_eurus.render();
        cape.render(entity);
    }
    if (entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer")) {
        wing.render(entity, entity.getInterpolatedData("fiskheroes:dyn/nanite_timer"));
    }
    if (!isFirstPersonArm) {
        shrink_lights.opacity = shrink_lights.progress = entity.getInterpolatedData("tmhp:dyn/spiritdive2_timer");
        shrink_lights.progress /= Math.sqrt(entity.getData('tmhp:dyn/spiritdive2_timer') > 0) * 2;
        shrink_lights.render(renderLayer);
    }
}