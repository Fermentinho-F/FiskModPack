extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:jedi/anakinskywalker_layer1",
    "layer2": "swhp:jedi/anakinskywalker_layer2",
    "lightsaber": "swhp:lightsaber/lightsaber_anakin"
});

var utils = implement("fiskheroes:external/utils");
var lightsaber = implement("swhp:external/lightsaber");
var abilities = implement("swhp:external/abilities");

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
    addAnimationWithData(renderer, "anakin.AIMING", "fiskheroes:aiming_left", "fiskheroes:aiming_timer")
        .priority = 10;
    addAnimationWithData(renderer, "anakin.FORCEPUSHCHARGE", "swhp:forcepush_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "anakin.FORCEPUSH", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "anakin.FORCEPUSHSTOP", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "anakin.HEROICMIGHTCHARGE", "swhp:heroicmight_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "anakin.HEROICMIGHT", "swhp:heroicmight", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "anakin.HEROICMIGHTSTOP", "swhp:heroicmight", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2 && !entity.getData("fiskheroes:beam_charging")));
    lightsaber.initSingleAnimations(renderer, "anakin", "jedi")
}

function initEffects(renderer) {

    saber = lightsaber.initSingle(renderer, "anakin", 0x0000FF);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x2719C7, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x2719C7, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2));

    abilities.initHeroicMight(renderer, "jedi", 2);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0x2719C7, [
        { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/jedi_ability_cycle") == 3));

    lightsaber.initSingleParticles(renderer, "blue");
}

function render(entity, renderLayer, isFirstPersonArm) {
    saber.render(entity, renderLayer);
}
