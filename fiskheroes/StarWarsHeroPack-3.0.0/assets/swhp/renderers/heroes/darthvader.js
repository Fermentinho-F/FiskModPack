extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:sith/darthvader_layer1",
    "layer2": "swhp:sith/darthvader_layer2",
    "cape": "swhp:sith/darthvader_cape",
    "mechanicalsuit_lights": "swhp:sith/darthvader_lights",
    "lightsaber": "swhp:lightsaber/lightsaber_darthvader",
    "special": "swhp:sith/darthvader_special"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var lightsaber = implement("swhp:external/lightsaber");
var abilities = implement("swhp:external/abilities");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity) => entity.getData("swhp:dyn/mechanicalsuit") ? "mechanicalsuit_lights" : null);
    initEffects(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimation(renderer, "darthvader.MECHANICALSUITDISABLED", "swhp:mechanicalsuit")
        .setData((entity, data) => data.load(entity.isAlive()))
        .setCondition(entity => ((!entity.getData("swhp:dyn/mechanicalsuit")) && (entity.as("DISPLAY").getDisplayType() != "HOLOGRAM")))
        .priority = 10;
    addAnimation(renderer, "darthvader.MECHANICALSUITENABLE", "swhp:mechanicalsuitenable")
        .setData((entity, data) => data.load(entity.getInterpolatedData("swhp:dyn/mechanicalsuit_timer")))
        .setCondition(entity => ((entity.getInterpolatedData("swhp:dyn/mechanicalsuit_timer") > 0 && entity.getInterpolatedData("swhp:dyn/mechanicalsuit_timer") < 1.0) && entity.getHeldItem().isEmpty()) && entity.getData("fiskheroes:shield_blocking_timer") == 0)
        .priority = 11;
    addAnimation(renderer, "darthvader.LEAP", "swhp:leap_darthvader")
        .setData((entity, data) => data.load(1.0))
        .setCondition(entity => (entity.getData("swhp:dyn/mechanicalsuit") && !entity.isOnGround()))
        .priority = 12;
    addAnimationWithData(renderer, "darthvader.FORCECHOKE", "swhp:forcegrab", "fiskheroes:energy_projection_timer");
    addAnimationWithData(renderer, "darthvader.FORCEPUSHCHARGE", "swhp:forcepush_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthvader.FORCEPUSH", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthvader.FORCEPUSHSTOP", "swhp:forcepush", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "darthvader.FURYCHARGE", "swhp:fury_charge", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthvader.FURY", "swhp:fury", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && entity.getData("fiskheroes:beam_shooting")));
    addAnimationWithData(renderer, "darthvader.FURYSTOP", "swhp:fury", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2 && !entity.getData("fiskheroes:beam_charging")));
    addAnimationWithData(renderer, "darthvader.LIGHTSABERTHROW", "swhp:lightsaberthrowaiming", "fiskheroes:beam_charge").setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/sith_ability_cycle") == 3));
    lightsaber.initSingleAnimations(renderer, "darthvader", "darthvader");
}

function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.maxFlare = 0.2;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");
    cape.effect.width = 12;

    saber = lightsaber.initSingle(renderer, "darthvader", 0xff232d);

    special = abilities.initVaderSpecial(renderer, "sith", 2);

    utils.bindBeam(renderer, "fiskheroes:energy_projection", "swhp:invisible", "leftArm", 0xff232d, [
        { "firstPerson": [3.75, 3.0, -8.0], "offset": [-0.5, 12.0, 0.0], "size": [1.0, 1.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 0));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xff232d, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 1));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xff232d, [
        { "firstPerson": [0.5, -1.0, -9.0], "offset": [-0.5, 8.0, -14.0], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/sith_ability_cycle") == 2));

    fury = abilities.initFury(renderer, "sith", 2);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "swhp:invisible", "rightArm", 0xff232d, [
        { "firstPerson": [-4.75, 3.0, -13.0], "offset": [-0.6, 19.0, -1.5], "size": [2.0, 2.0] }
    ]).setCondition(entity => (entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/sith_ability_cycle") == 3));

    lightsaber.initSingleParticles(renderer, "red");

    var specialmove1 = renderer.createResource("MODEL", "swhp:special_darthvader");
    specialmove1.texture.set("special");
    specialmove1.bindAnimation("swhp:vaderspecial1").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:beam_charge"));
	  });

    var specialmove2 = renderer.createResource("MODEL", "swhp:special_darthvader");
    specialmove2.texture.set("special");
    specialmove2.bindAnimation("swhp:vaderspecial2").setData((entity, data) => {
		data.load(entity.getInterpolatedData("fiskheroes:beam_shooting"));
	  });

    special1 = renderer.createEffect("fiskheroes:model").setModel(specialmove1);
    special1.anchor.set("head");

    special2 = renderer.createEffect("fiskheroes:model").setModel(specialmove2);
    special2.anchor.set("head");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    saber.render(entity, renderLayer);
    fury.render(entity, renderLayer);
    if (entity.getData("swhp:dyn/sith_ability_cycle") == 2) {
        if (entity.getData("fiskheroes:beam_charging") && entity.getInterpolatedData("fiskheroes:beam_charge") < 1) {
            special1.render();
        }
        if (entity.getInterpolatedData("fiskheroes:beam_charge") == 1 && entity.getInterpolatedData("fiskheroes:beam_shooting_timer") > 0) {
            special2.render();
        }
    }
}
