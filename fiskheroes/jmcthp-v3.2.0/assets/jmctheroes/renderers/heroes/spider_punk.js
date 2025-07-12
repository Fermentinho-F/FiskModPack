extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:spiderman/spider_man_punk_layer1",
    "layer2": "jmctheroes:spiderman/spider_man_punk_layer2",
    "head": "jmctheroes:spiderman/spider_spikes_head",
    "spidersense": "jmctheroes:spiderman/spidersense",
    "guitar": "jmctheroes:spiderman/spider_guitar"
});

var utils = implement("fiskheroes:external/utils");

var spikes;
var guitar;
var handsguitar;
var sense;

function init(renderer) {
    parent.init(renderer);
    sense = renderer.createEffect("fiskheroes:model");
    sense.setModel(utils.createModel(renderer, "jmctheroes:spideysense", null, "spidersense"));
    sense.anchor.set("head");
}

function initEffects(renderer) {
    var spiderguitar = renderer.createResource("MODEL", "jmctheroes:spiderguitarback");

    spiderguitar.bindAnimation("jmctheroes:guitar_swing").setData((entity, data) => data.load(entity.getInterpolatedData("fiskheroes:web_swinging_timer")));
    spiderguitar.texture.set("guitar");
    guitar = renderer.createEffect("fiskheroes:model").setModel(spiderguitar);
    guitar.anchor.set("body");

    spikes = renderer.createEffect("fiskheroes:model");
    spikes.setModel(utils.createModel(renderer, "jmctheroes:spiderspikeshead", "head", null));
    spikes.anchor.set("head");
    
    handsguitar = renderer.createEffect("fiskheroes:model");
    handsguitar.setModel(utils.createModel(renderer, "jmctheroes:spiderguitarfront", "guitar", null));
    guitar.anchor.set("body");
    
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "jmctheroes:beam", "body", getBeamColor(), [
        { "firstPerson": [0.0, 0.0, 0.0], "offset": [0.0, 0.0, 0.0], "size": [20, 20] }
    ]);
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x53469C);
}

function getBeamColor() {
    return 0xE3E3E3;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.CHARGED_BEAM");
    addAnimation(renderer, "rockout.PUNK", "jmctheroes:guitar_strike").setData((entity, data) => data.load(
        (entity.getData("fiskheroes:beam_charging") ? entity.getInterpolatedData("fiskheroes:beam_charge") : 0)));

    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;
    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;
    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;
        
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", ["fiskheroes:swing_right", "jmctheroes:swing_right2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", ["fiskheroes:swing_left", "jmctheroes:swing_left2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", ["jmctheroes:swing_right2", "fiskheroes:swing_default"]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", ["jmctheroes:rockstar_swing", "jmctheroes:rockstar_spin", "jmctheroes:swing_roll6", "fiskheroes:swing_roll2", "fiskheroes:swing_roll5", "jmctheroes:swing_roll7", "jmctheroes:swing_roll8"]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right1");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left1");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", "fiskheroes:swing_dive2");
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", ["fiskheroes:swing_springboard", "jmctheroes:swing_roll6"]);
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
    utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");

}

function render(entity, renderLayer, isFirstPersonArm){
  var slow = entity.getData("fiskheroes:slow_motion");
  var blade = entity.getData("fiskheroes:beam_charging") ? entity.getInterpolatedData("fiskheroes:beam_charge") : 0 && !entity.isDisplayStand();
  var noblade = !entity.getData("fiskheroes:beam_charging") || entity.isDisplayStand();
  
    if (renderLayer == "CHESTPLATE" && noblade) {
        guitar.render();
    }
    if (renderLayer == "CHESTPLATE" && blade) {
        handsguitar.render();
    }
    if (renderLayer == "HELMET" && slow) {
        sense.render();
    }
    if (renderLayer == "HELMET") {
        spikes.render();
    }
}