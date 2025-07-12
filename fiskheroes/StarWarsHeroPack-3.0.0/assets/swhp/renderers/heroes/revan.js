extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:jedi/revan_layer1",
    "layer2": "swhp:jedi/revan_layer2",
    "lightsaber": "swhp:lightsaber/lightsaber_revan",
    "special": "swhp:sith/darthvader_special"
});

var utils = implement("fiskheroes:external/utils");
var lightsaber = implement("swhp:external/lightsaber");
var abilities = implement("swhp:external/abilities");

function init(renderer) {
    parent.init(renderer);
    initEffects(renderer);
    initAnimations(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimationWithData(renderer, "revan.AIMING", "fiskheroes:aiming_left", "fiskheroes:aiming_timer")
        .priority = 10;
    addAnimationWithData(renderer, "revan.FORCECRUSH", "swhp:forcegrab", "fiskheroes:energy_projection_timer");
    addAnimationWithData(renderer, "revan.FORCEPUSHCHARGE", "swhp:forcepush_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "revan.FORCEPUSH", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "revan.FORCEPUSHSTOP", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "revan.FURYCHARGE", "swhp:fury_charge_revan", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "revan.FURY", "swhp:fury", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "revan.FURYSTOP", "swhp:fury", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2 && !entity.getData("fiskheroes:beam_charging")));
    lightsaber.initSingleAnimations(renderer, "revan", "jedi");
}

function initEffects(renderer) {
    saber = lightsaber.initSingle(renderer, "revan", 0x7e21ce);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "swhp:invisible", "leftArm", 0x7e21ce, [
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.0, 1.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 0));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x7e21ce, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2));

    fury = abilities.initFury(renderer, "jedi", 2);

    lightsaber.initSingleParticles(renderer, "purple");
}

function render(entity, renderLayer, isFirstPersonArm) {
    saber.render(entity, renderLayer);
    fury.render(entity, renderLayer);
}
