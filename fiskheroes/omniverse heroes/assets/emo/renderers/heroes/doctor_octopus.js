extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:yok",
    "layer2": "emo:yok",
    "anti": "emo:anti",
    "segment": "emo:white",
    "claw": "emo:white",
});

var utils = implement("fiskheroes:external/utils");

var anti;

function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("CHESTPLATE");;
}

function initEffects(renderer) {
    var ock_arm = utils.createModel(renderer, "emo:arms2", "segment");
    var ock_claw = utils.createModel(renderer, "emo:claw", "claw");
    ock_claw.bindAnimation("fiskheroes:ock_claw").setData((entity, data) => {
        var t = entity.as("TENTACLE");
        data.load(0, 1 - Math.min(t.getCaster().getInterpolatedData("fiskheroes:tentacle_extend_timer") * 2, 1));
        data.load(1, t.getIndex());
        data.load(2, t.getGrabTimer());
        data.load(3, t.getStrikeTimer());
    });

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([
        { "offset": [2.0, -4.5, -2.0], "direction": [13.0, 10.0, -10.0] },
        { "offset": [-2.0, -4.5, -2.0], "direction": [-13.0, 10.0, -10.0] },
        { "offset": [2.0, -7.5, -2.0], "direction": [13.0, -10.0, -10.0] },
        { "offset": [-2.0, -7.5, -2.0], "direction": [-13.0, -10.0, -10.0] }
    ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(ock_arm);
    tentacles.setHeadModel(ock_claw);
    tentacles.segmentLength = 1.8;
    tentacles.segments = 16;

    anti = renderer.createEffect("fiskheroes:overlay");
    anti.texture.set("anti");
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

function render(entity, renderLayer, isFirstPersonArm) { 
    if (renderLayer == "CHESTPLATE") {
        anti.opacity = entity.getInterpolatedData("fiskheroes:dyn/nanite_timer");
        anti.render();
    }
}
