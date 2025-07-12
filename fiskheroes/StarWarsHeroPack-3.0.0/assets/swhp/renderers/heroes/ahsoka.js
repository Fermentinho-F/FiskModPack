extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:jedi/ahsoka_layer1",
    "layer2": "swhp:jedi/ahsoka_layer2",
    "lightsaberright": "swhp:lightsaber/lightsaber_ahsoka",
    "lightsaberleft": "swhp:lightsaber/lightsaber_ahsoka"
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
    addAnimationWithData(renderer, "ahsoka.AIMING", "fiskheroes:aiming_left", "fiskheroes:aiming_timer")
        .priority = 10;
    addAnimationWithData(renderer, "ahsoka.FORCEPUSHCHARGE", "swhp:forcepush_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "ahsoka.FORCEPUSH", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "ahsoka.FORCEPUSHSTOP", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 1 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "ahsoka.SHOTODANCECHARGE", "swhp:shotodance_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2  && entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "ahsoka.SHOTODANCE", "swhp:shotodance", "fiskheroes:beam_shooting").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2));
    addAnimationWithData(renderer, "ahsoka.SHOTODANCESTOP", "swhp:nothing", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/jedi_ability_cycle") == 2 && !entity.getData("fiskheroes:beam_charging")));
    lightsaber.initDualBackwardsAnimations(renderer, "ahsoka", "ahsoka");
}

function initEffects(renderer) {

    saber = lightsaber.initDualBackwards(renderer, "ahsoka", "ahsoka", 0x0000FF, 0x0000FF);

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

    lightsaber.initDualBackwardsParticles(renderer, "blue", "blue");
}

function render(entity, renderLayer, isFirstPersonArm) {
    saber.render(entity, renderLayer);
}
