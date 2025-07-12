extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "jmctheroes:2099/spider_man_2099_layer1",
    "layer2": "jmctheroes:2099/spider_man_2099_layer2",
    "spikes": "jmctheroes:2099/spider_man_2099_spikes",
    "claws": "jmctheroes:2099/spider_man_2099_claws",
    "web_wings": "jmctheroes:2099/spider_man_2099_wings"
});

var utils = implement("fiskheroes:external/utils");

var web_wings;
var overlay;
var spikesl;
var spikes;
var cape;

function init(renderer) {
    parent.init(renderer);

    spikes = renderer.createEffect("fiskheroes:model");
    spikes.setModel(utils.createModel(renderer, "jmctheroes:spikes", "spikes", null));
    spikes.anchor.set("rightArm");

    spikesl = renderer.createEffect("fiskheroes:model");
    spikesl.setModel(utils.createModel(renderer, "jmctheroes:spikesleft", "spikes", null));
    spikesl.anchor.set("leftArm");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("claws");

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 0.70;

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x6E0C0C);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:blade")) {
        overlay.render();
    }
    if (renderLayer == "CHESTPLATE") {
        spikesl.render();
        spikes.render();
    }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
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
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", ["fiskheroes:swing_roll", "fiskheroes:swing_roll2", "fiskheroes:swing_roll5", "jmctheroes:swing_roll6", "jmctheroes:swing_roll7"]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", ["fiskheroes:swing_dive", "fiskheroes:swing_dive2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", ["fiskheroes:swing_springboard", "jmctheroes:swing_roll6"]);
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
    utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
}