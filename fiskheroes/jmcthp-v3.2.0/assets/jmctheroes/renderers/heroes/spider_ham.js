extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:blank",
    "layer2": "jmctheroes:blank",
    "ham": "jmctheroes:ham/pig",
    "hammer": "jmctheroes:ham/hamhammer",
    "spidersense": "jmctheroes:spiderman/spidersense",
    "spider_pig_layer1": "jmctheroes:ham/spider_pig_layer1",
    "spider_pig_layer2": "jmctheroes:ham/spider_pig_layer2",
});

var utils = implement("fiskheroes:external/utils");

var sense;

var overlay1, overlay2;

function init(renderer) {
    parent.init(renderer);

    sense = renderer.createEffect("fiskheroes:model");
    sense.setModel(utils.createModel(renderer, "jmctheroes:spideysense1", null, "spidersense"));
    sense.anchor.set("head");
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x53469C);
    utils.setOpacity(renderer, 0.5, 0.1);

    overlay1 = renderer.createEffect("fiskheroes:overlay");
    overlay2 = renderer.createEffect("fiskheroes:overlay");

    head2 = renderer.createEffect("fiskheroes:model");
    head2.setModel(utils.createModel(renderer, "jmctheroes:ham/hamhead2", "ham", null));
    head2.anchor.set("head");

    head = renderer.createEffect("fiskheroes:model");
    head.setModel(utils.createModel(renderer, "jmctheroes:ham/hamhead", "ham", null));
    head.anchor.set("head");
    body = renderer.createEffect("fiskheroes:model");
    body.setModel(utils.createModel(renderer, "jmctheroes:ham/hamchest", "ham", null));
    body.anchor.set("body");
    rightarm = renderer.createEffect("fiskheroes:model");
    rightarm.setModel(utils.createModel(renderer, "jmctheroes:ham/hamrightarm", "ham", null));
    rightarm.anchor.set("rightArm");
    leftarm = renderer.createEffect("fiskheroes:model");
    leftarm.setModel(utils.createModel(renderer, "jmctheroes:ham/hamleftarm", "ham", null));
    leftarm.anchor.set("leftArm");
    rightleg = renderer.createEffect("fiskheroes:model");
    rightleg.setModel(utils.createModel(renderer, "jmctheroes:ham/hamrightleg", "ham", null));
    rightleg.anchor.set("rightLeg");
    rightleg.setOffset(0.0, 3.0, 0.0);
    leftleg = renderer.createEffect("fiskheroes:model");
    leftleg.setModel(utils.createModel(renderer, "jmctheroes:ham/hamleftleg", "ham", null));
    leftleg.anchor.set("leftLeg");
    leftleg.setOffset(0.0, 3.0, 0.0);
    hammer = renderer.createEffect("fiskheroes:model");
    hammer.setModel(utils.createModel(renderer, "jmctheroes:ham/hamhammer", "hammer", null));
    hammer.anchor.set("rightArm");
    hammer.setOffset(0.0, -3.0, 0.0);
    hammer.setScale(1.25);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "spider.SUIT", "jmctheroes:pig").setData((entity, data) => {
        data.load(Math.max(entity.isAlive()));
    });
    addAnimation(renderer, "basic.BLADE", "jmctheroes:hamhammer").setData((entity, data) => {
        data.load(Math.max(entity.getInterpolatedData('fiskheroes:blade_timer')));
    });
    renderer.removeCustomAnimation("basic.AIMING");
    addAnimationWithData(renderer, "spiderman.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;
    addAnimationWithData(renderer, "spiderman.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;
    addAnimationWithData(renderer, "spiderman.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
        .priority = 5;

    addAnimationWithData(renderer, "spiderman.HAMMER_POSE", "jmctheroes:hammer_pose", "fiskheroes:blade_timer");
        
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", ["fiskheroes:swing_right", "jmctheroes:swing_right2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", ["fiskheroes:swing_left", "jmctheroes:swing_left2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", ["jmctheroes:swing_right2", "fiskheroes:swing_default"]);

    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", ["fiskheroes:swing_roll", "fiskheroes:swing_roll2", "fiskheroes:swing_roll5", "jmctheroes:swing_roll6", "jmctheroes:swing_roll7", "jmctheroes:swing_roll8"]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", "fiskheroes:swing_rotate_right");
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", "fiskheroes:swing_rotate_left");
    utils.addAnimationEvent(renderer, "WEBSWING_ZIP", "fiskheroes:swing_zip");
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", ["fiskheroes:swing_dive", "fiskheroes:swing_dive2"]);
    utils.addAnimationEvent(renderer, "WEBSWING_LEAP", "fiskheroes:swing_springboard");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_RIGHT", "fiskheroes:web_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSHOOTER_SHOOT_LEFT", "fiskheroes:web_shoot_left");
    utils.addAnimationEvent(renderer, "CEILING_CRAWL", "fiskheroes:crawl_ceiling");
}

function render(entity, renderLayer, isFirstPersonArm){
    var slow = entity.getData("fiskheroes:slow_motion");
    var stand = !entity.isWearingFullSuit() || entity.isDisplayStand();
    var suit = entity.isWearingFullSuit() && !entity.isDisplayStand();
    if (suit) {
        head.render();
        body.render();
        rightarm.render();
        leftarm.render();
        rightleg.render();
        leftleg.render();
    }
    if (stand) {
        if (renderLayer == "HELMET" || renderLayer == "CHESTPLATE" || renderLayer == "BOOTS") {
            overlay1.render();
            overlay1.texture.set("spider_pig_layer1");
            head2.render();
        }
        else if (renderLayer == "LEGGINGS") {
            overlay2.render();
            overlay2.texture.set("spider_pig_layer2");
        }
    }
    if (renderLayer == "HELMET" && slow) {
        sense.render();
    }
    if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:blade_timer") > 0.5) {
        hammer.render();
    }
}