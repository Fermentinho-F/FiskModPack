extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "moopack:dna/dna_base"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {    

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
}
