extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:spiderman/spider_man_2002_layer1",
    "layer2": "jmctheroes:spiderman/spider_man_2002_layer2",
    "layer3": "jmctheroes:spiderman/spider_man_2002_layer3",
    "symbiote1": "jmctheroes:spiderman/spider_man_2002_symbiote_layer1",
    "symbiote2": "jmctheroes:spiderman/spider_man_2002_symbiote_layer2",
    "spidersense": "jmctheroes:spiderman/spidersense",
    "web_rope": "jmctheroes:webs/web_rope.tx.json",
    "web_small": "jmctheroes:webs/web_small.tx.json",
    "web_large": "jmctheroes:webs/web_large.tx.json",
    "blank": "jmctheroes:blank"
});

var utils = implement("fiskheroes:external/utils");

var overlay, overlaySecond;

var sense;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE" || renderLayer == "HELMET" || renderLayer == "BOOTS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/symbiote_timer");
            return timer == 0 ? "layer1" : timer < 1 ? "layer3" : "blank";
        }
        if (renderLayer == "LEGGINGS") {
            var timer = entity.getInterpolatedData("jmctheroes:dyn/symbiote_timer");
            return timer == 0 ? "layer2" : timer < 1 ? "layer2" : "blank";
        }
        return "blank";
    });
    
    sense = renderer.createEffect("fiskheroes:model");
    sense.setModel(utils.createModel(renderer, "jmctheroes:spideysense", null, "spidersense"));
    sense.anchor.set("head");
}

function initEffects(renderer) {
    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("symbiote1", null);
    overlaySecond = renderer.createEffect("fiskheroes:overlay");
    overlaySecond.texture.set("symbiote2", null);

    var webs = renderer.bindProperty("fiskheroes:webs");

    webs.textureRope.set("web_rope", null);
    webs.textureSmall.set("web_small", null);
    webs.textureLarge.set("web_large", null);
    webs.textureRopeBase.set("web_large", null);

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x6F8EBF);
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
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_DEFAULT", ["fiskheroes:swing_roll", "fiskheroes:swing_roll2", "fiskheroes:swing_roll5", "jmctheroes:swing_roll6", "jmctheroes:swing_roll7", "jmctheroes:swing_roll8"]);
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

function render(entity, renderLayer, isFirstPersonArm){
    if (renderLayer == "CHESTPLATE" || renderLayer == "HELMET" || renderLayer == "BOOTS") {
        overlay.opacity = entity.getInterpolatedData("jmctheroes:dyn/symbiote_timer");
        overlay.render();
    }
    if (renderLayer == "LEGGINGS") {
        overlaySecond.opacity = entity.getInterpolatedData("jmctheroes:dyn/symbiote_timer");
        overlaySecond.render();
    }
    var slow = entity.getData("fiskheroes:slow_motion");
    if (renderLayer == "HELMET" && slow) {
        sense.render();
    }
}