extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "dmh:yt_suits/rs/rs_layer1",
    "layer2": "dmh:yt_suits/rs/rs_layer2",
    "web_wings": "dmh:yt_suits/rs/rs_wings",
    "web_small": "dmh:yt_suits/rs/rs_web",
    "web_large": "dmh:yt_suits/rs/rs_web_24",
    "web_rope": "dmh:yt_suits/rs/rs_web_rope"
});

var web_wings;
var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData("fiskheroes:mask_open_timer2") > 0.35)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });
}

function initEffects(renderer) {
    var webs = renderer.bindProperty("fiskheroes:webs");
    webs.textureRope.set("web_rope");
    webs.textureLarge.set("web_large");
    webs.textureSmall.set("web_small");
    webs.textureRopeBase.set("web_small");

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 0.99;

    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00DAFF);

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "dmh:db", "rightArm", 0x9518b2, [
        { "firstPerson": [-4.5, 3.75, -7.0], "offset": [-0.5, 9.0, 0.0], "size": [2.0, 2.0] }
    ]);

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "dmh:black");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "REVENANT_SPIDER.MASK", "fiskheroes:remove_cowl")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
            data.load(f < 1 ? f : 0);
        });

    renderer.removeCustomAnimation("basic.AIMING");

    renderer.removeCustomAnimation("basic.CHARGED_BEAM");

    addAnimationWithData(renderer, "REVENANT_SPIDER.ANTIBLAST", "fiskheroes:aiming", "fiskheroes:beam_charge");

    addAnimationWithData(renderer, "REVENANT_SPIDER.AIMING", "fiskheroes:web_aim_right", "fiskheroes:web_aim_right_timer")
        .priority = 2;

    addAnimationWithData(renderer, "REVENANT_SPIDER.AIMING_LEFT", "fiskheroes:web_aim_left", "fiskheroes:web_aim_left_timer")
        .priority = 2;

    addAnimationWithData(renderer, "REVENANT_SPIDER.WEB_RAPPEL", "fiskheroes:web_rappel", "fiskheroes:web_rappel_timer")
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
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
        web_wings.render();
    }
}