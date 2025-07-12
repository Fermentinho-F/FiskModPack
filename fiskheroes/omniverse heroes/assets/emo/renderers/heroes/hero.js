extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "omnitrix": "emo:saatler/theomnitrixhero",
    "kr": "emo:herokripto",
    "mar": "emo:heromartian",
    "speed": "emo:herospeed",
    "spider": "emo:herospider",
    "ates": "emo:herostorm",
});

var utils = implement("fiskheroes:external/utils");

var omnitrix;
var kr;
var mar;
var speed;
var spider;
var ates;
var glow;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) {
    glow = renderer.createEffect("fiskheroes:glowerlay");
    glow.color.set(0x40E7F9);

    omnitrix = renderer.createEffect("fiskheroes:model");
    omnitrix.setModel(utils.createModel(renderer, "emo:theomnitrixhero", "omnitrix"));
    omnitrix.anchor.set("rightArm");
    omnitrix.mirror = false;

    kr = renderer.createEffect("fiskheroes:overlay");
    kr.texture.set("kr");

    mar = renderer.createEffect("fiskheroes:overlay");
    mar.texture.set("mar");
    
    speed = renderer.createEffect("fiskheroes:overlay");
    speed.texture.set("speed");

    spider = renderer.createEffect("fiskheroes:overlay");
    spider.texture.set("spider");

    ates = renderer.createEffect("fiskheroes:overlay");
    ates.texture.set("ates");

    utils.setOpacityWithData(renderer, 0.0, 1.0, "fiskheroes:shadowform_timer");
    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "emo:herotrix").setCondition(entity => entity.getData("fiskheroes:shadowform"));
    utils.bindParticles(renderer, "fiskheroes:black_lightning").setCondition(entity => entity.getData("fiskheroes:gliding"));
    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));
    utils.bindBeam(renderer, "fiskheroes:heat_vision", "fiskheroes:cold_beam", "head", 0xFF0000, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "fiskheroes:cold_beam", "head", 0xFF0000, [
        { "firstPerson": [2.0, 0.0, 1.0], "offset": [2.0, -3.0, -3.0], "size": [1.0, 0.5] },
        { "firstPerson": [-2.0, 0.0, 1.0], "offset": [-2.0, -3.0, -3.0], "size": [1.0, 0.5] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_heat_vision"));
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "fiskheroes:mysterio_beam", "head", 0x40E7F9, [
        { "firstPerson": [0.0, 1.0, 0.0], "offset": [0.0, -1.0, -4.0], "size": [1.2, 0.7] }
    ]).setParticles(renderer.createResource("PARTICLE_EMITTER", "fiskheroes:impact_energy_projection"));
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x1661DA, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xFF6BFF, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);
    utils.bindTrail(renderer, "emo:lightning_pink");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
    .priority = 2;

addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
    .priority = 2;

addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
    .priority = 5;

utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_right");
utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_left");
utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", [
    "fiskheroes:swing_roll",
    "fiskheroes:swing_roll2",
    "fiskheroes:swing_roll5"
]);
utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
    "fiskheroes:swing_dive",
    "fiskheroes:swing_dive2"
]);
utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        kr.opacity = entity.getInterpolatedData("emo:dyn/insanazor_timer");
        kr.render();
    }
    if (renderLayer == "CHESTPLATE") {
        speed.opacity = entity.getInterpolatedData("emo:dyn/xlr_timer");
        speed.render();
    }
    if (renderLayer == "CHESTPLATE") {
        mar.opacity = entity.getInterpolatedData("emo:dyn/jetray_timer");
        mar.render();
    }
    if (renderLayer == "CHESTPLATE") {
        spider.opacity = entity.getInterpolatedData("emo:dyn/iguana_timer");
        spider.render();
    }
    if (renderLayer == "CHESTPLATE") {
        ates.opacity = entity.getInterpolatedData("emo:dyn/ates_timer");
        ates.render();
    }
    omnitrix.opacity = !entity.getData('emo:dyn/insanazor_timer') && !entity.getData('emo:dyn/xlr_timer') && !entity.getData('emo:dyn/jetray_timer') && !entity.getData('emo:dyn/iguana_timer') && !entity.getData('emo:dyn/ates_timer');
    omnitrix.render();

    glow.opacity = entity.getData('emo:dyn/insanazor_timer') > 0 && entity.getData('emo:dyn/insanazor_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/xlr_timer') > 0 && entity.getData('emo:dyn/xlr_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/jetray_timer') > 0 && entity.getData('emo:dyn/jetray_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/iguana_timer') > 0 && entity.getData('emo:dyn/iguana_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/ates_timer') > 0 && entity.getData('emo:dyn/ates_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/waybig_timer') > 0 && entity.getData('emo:dyn/waybig_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/hayalet_timer') > 0 && entity.getData('emo:dyn/hayalet_timer') < 1;
    glow.render();

    glow.opacity = entity.getData('emo:dyn/echo_timer') > 0 && entity.getData('emo:dyn/echo_timer') < 1;
    glow.render();
}