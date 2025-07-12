extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:sith/darthrevan_layer1",
    "layer2": "swhp:sith/darthrevan_layer2",
    "cape": "swhp:sith/darthrevan_cape",
    "lightsaberright": "swhp:lightsaber/lightsaber_revan",
    "lightsaberleft": "swhp:lightsaber/lightsaber_revan",
    "special": "swhp:sith/darthvader_special"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var lightsaber = implement("swhp:external/lightsaber");
var abilities = implement("swhp:external/abilities");

var cape;
var forcelightningsurgearm;

function init(renderer) {
    parent.init(renderer);
    initEffects(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimationWithData(renderer, "darthrevan.AIMING", "fiskheroes:aiming_left", "fiskheroes:aiming_timer")
        .priority = 10;
    addAnimationWithData(renderer, "darthrevan.FORCECHOKE", "swhp:forcegrab", "fiskheroes:energy_projection_timer");
    addAnimationWithData(renderer, "darthrevan.FORCEPUSHCHARGE", "swhp:forcepush_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthrevan.FORCEPUSH", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthrevan.FORCEPUSHSTOP", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "darthrevan.FORCELIGHTNINGCHARGE", "swhp:forcepush_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthrevan.FORCELIGHTNING", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthrevan.FORCELIGHTNINGSTOP", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "darthrevan.FURYCHARGE", "swhp:lightningstorm_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 3 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthrevan.FURY", "swhp:lightningstorm_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 3 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthrevan.FURYSTOP", "swhp:lightningstorm_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 3 && !entity.getData("fiskheroes:beam_charging")));
    lightsaber.initDualAnimations(renderer, "darthrevan", "revan");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    saber = lightsaber.initDual(renderer, "revan", "revan", 0x7e21ce, 0xff232d, -4.8);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "swhp:invisible", "leftArm", 0x7e21ce, [
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.0, 1.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 0));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1));

    abilities.initForceLightning(renderer, 0x703BE7, "sith", 2);

    abilities.initLightningStorm(renderer, 0x703BE7, "sith", 3);

    lightsaber.initDualParticles(renderer, "purple", "red");

    var forcelightningsurge_beam = renderer.createResource("BEAM_RENDERER", "swhp:forcelightningsurge");

    forcelightningsurgearm = utils.createLines(renderer, forcelightningsurge_beam, 0x703BE7, [
        {"start": [0.3, -1.0, -1.1], "end": [1.7, 6.5, -1.1], "size": [10.0, 10.0]},
        {"start": [1.7, -1.0, -1.1], "end": [0.3, 6.5, -1.1], "size": [10.0, 10.0]},

        {"start": [0.3, -1.0, 1.1], "end": [1.7, 6.5, 1.1], "size": [10.0, 10.0]},
        {"start": [1.7, -1.0, 1.1], "end": [0.3, 6.5, 1.1], "size": [10.0, 10.0]},

        {"start": [1.8, -1.0, 1.0], "end": [1.8, 6.5, -1.0], "size": [10.0, 10.0]},
        {"start": [1.8, -1.0, -1.0], "end": [1.8, 6.5, 1.0], "size": [10.0, 10.0]},

        {"start": [-0.4, -1.0, 1.0], "end": [-0.4, 6.5, -1.0], "size": [10.0, 10.0]},
        {"start": [-0.4, -1.0, -1.0], "end": [-0.4, 6.5, 1.0], "size": [10.0, 10.0]},
    ]);
    forcelightningsurgearm.anchor.set("leftArm");
    forcelightningsurgearm.setScale(1.5);
    forcelightningsurgearm.mirror = false;

    var lightningstorm_beam = renderer.createResource("BEAM_RENDERER", "swhp:lightningstorm");

    lightningstorm = utils.createLines(renderer, lightningstorm_beam, 0x703BE7, [
        {"start": [-30.0, -200.0, -2.0], "end": [-30.0, 40.0, -2.0], "size": [10.0, 10.0]},

        {"start": [35.0, -200.0, -20.0], "end": [35.0, 40.0, -20.0], "size": [10.0, 10.0]},

        {"start": [15.0, -200.0, -35.0], "end": [15.0, 40.0, -35.0], "size": [10.0, 10.0]},

        {"start": [-25.0, -200.0, -25.0], "end": [-25.0, 40.0, -25.0], "size": [10.0, 10.0]},

        {"start": [-4.0, -200.0, -50.0], "end": [-4.0, 40.0, -50.0], "size": [10.0, 10.0]},

        {"start": [4.0, -200.0, 50.0], "end": [4.0, 40.0, 50.0], "size": [10.0, 10.0]},

        {"start": [20.0, -200.0, 25.0], "end": [20.0, 40.0, 25.0], "size": [10.0, 10.0]},

        {"start": [-15.0, -200.0, 15.0], "end": [-15.0, 40.0, 15.0], "size": [10.0, 10.0]},
    ]);
    lightningstorm.anchor.set("body");
    lightningstorm.setScale(2.5);
    lightningstorm.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) {
    saber.render(entity, renderLayer);
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    if (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && entity.getData("fiskheroes:beam_charge")){
        forcelightningsurgearm.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        forcelightningsurgearm.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        forcelightningsurgearm.render();
    }
    if (entity.getData("swhp:dyn/sith_ability_cycle") == 3 && entity.getData("fiskheroes:beam_charging")){
        lightningstorm.progress = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        lightningstorm.opacity = Math.max(1 - (1 - entity.getInterpolatedData('fiskheroes:beam_charge')) * 1, 0);
        lightningstorm.render();
    }
}
