extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:sith/darthmaul_layer1",
    "layer2": "swhp:sith/darthmaul_layer2",
    "horns": "swhp:sith/darthmaul_horns",
    "lightsaber": "swhp:lightsaber/lightsaber_darthmaul"
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
    addAnimationWithData(renderer, "darthmaul.AIMING", "fiskheroes:aiming_left", "fiskheroes:aiming_timer")
        .priority = 10;
    addAnimationWithData(renderer, "darthmaul.GLIDING", "swhp:lightsaber_doublebladed_gliding", "fiskheroes:gliding");
    addAnimationWithData(renderer, "darthmaul.FORCECRUSH", "swhp:forcegrab", "fiskheroes:energy_projection_timer");
    addAnimationWithData(renderer, "darthmaul.FORCEPUSHCHARGE", "swhp:forcepush_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthmaul.FORCEPUSH", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthmaul.FORCEPUSHSTOP", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "darthmaul.DOUBLEBLADESPINCHARGE", "swhp:doublebladespin_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2  && entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "darthmaul.DOUBLEBLADESPIN", "swhp:doublebladespin", "fiskheroes:beam_shooting").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2));
    addAnimationWithData(renderer, "darthmaul.DOUBLEBLADESPINSTOP", "swhp:nothing", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "darthmaul.LIGHTSABERTHROW", "swhp:lightsaberthrowaiming", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/sith_ability_cycle") == 3));
    lightsaber.initDoubleAnimations(renderer, "darthmaul", "darthmaul");
}

function initEffects(renderer) {

    saber = lightsaber.initDouble(renderer, "darthmaul", 0xff232d, 0xff232d);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "swhp:invisible", "leftArm", 0xff232d, [
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.0, 1.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 0));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xff232d, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1));

    abilities.initDoubleBladeSpin(renderer, "sith", 2);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xff232d, [
        { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/sith_ability_cycle") == 3));

    lightsaber.initDoubleParticles(renderer, "red_maul");

    horns = renderer.createEffect("fiskheroes:model");
    horns.setModel(utils.createModel(renderer, "swhp:darthmaul_horns", "horns"));
    horns.anchor.set("head");
}

function render(entity, renderLayer, isFirstPersonArm) {
    saber.render(entity, renderLayer);
    if (renderLayer == "HELMET") {
        horns.render();
    }
}
