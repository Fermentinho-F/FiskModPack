extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "shadows:superior_spider/superior_spider_layer1",
    "layer2": "shadows:superior_spider/superior_spider_layer2",
    "arm": "shadows:superior_spider/superior_spider_arm",
    "claw": "shadows:superior_spider/superior_spider_claw",
    "talons": "shadows:superior_spider/superior_spider_talons",
    "web_wings": "fiskheroes:spider_man_wings"
});

var overlay;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "HELMET" && (entity.is("DISPLAY") && entity.as("DISPLAY").isStatic() ? entity.getData("fiskheroes:mask_open") : entity.getData('fiskheroes:mask_open_timer2') > 0.8)) {
            return "layer2";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.setItemIcons("superior_spider/%s_0", "superior_spider/%s_1", "superior_spider/%s_2", "superior_spider/%s_3");
}
function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipment_wheel").color.set(0x00DAFF);

    var superior_spider_arm = utils.createModel(renderer, "fiskheroes:ock_arm", "arm");
    var superior_spider_claw = utils.createModel(renderer, "shadows:superiorSpiderBlade", "claw");

    var tentacles = renderer.bindProperty("fiskheroes:tentacles").setTentacles([{
                    "offset": [1.0, -2.9, -2.0],
                    "direction": [13.0, 10.0, -10.0]
                }, {
                    "offset": [-1.0, -2.9, -2.0],
                    "direction": [-13.0, 10.0, -10.0]
                }, {
                    "offset": [1.0, -4.5, -2.0],
                    "direction": [13.0, -10.0, -10.0]
                }, {
                    "offset": [-1.0, -4.5, -2.0],
                    "direction": [-13.0, -10.0, -10.0]
                }
            ]);
    tentacles.anchor.set("body");
    tentacles.setSegmentModel(superior_spider_arm);
    tentacles.setHeadModel(superior_spider_claw);
    tentacles.segmentLength = 1.7;
    tentacles.segments = 16;

    web_wings = renderer.createEffect("fiskheroes:wingsuit");
    web_wings.texture.set("web_wings");
    web_wings.opacity = 0.99;

    overlay = renderer.createEffect("fiskheroes:overlay");
    overlay.texture.set("talons");

}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "flash.MASK", "fiskheroes:remove_cowl")
    .setData((entity, data) => {
        var f = entity.getInterpolatedData("fiskheroes:mask_open_timer2");
        data.load(f < 1 ? f : 0);
    });

    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_RIGHT", [
            "fiskheroes:swing_rotate_right", "fiskheroes:swing_rotate_right1"
        ]);
    utils.addAnimationEvent(renderer, "WEBSWING_TRICK_LEFT", [
            "fiskheroes:swing_rotate_left", "fiskheroes:swing_rotate_left1"
        ]);
    utils.addAnimationEvent(renderer, "WEBSWING_DIVE", [
            "fiskheroes:swing_dive",
            "fiskheroes:swing_dive2",
            "shadows:swinging/superior_spider_dive"
        ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        if (!isFirstPersonArm) {
            web_wings.unfold = entity.getInterpolatedData("fiskheroes:wing_animation_timer");
            web_wings.render();
        }
        if (entity.getData("fiskheroes:blade")) {
            overlay.render();
        }
    }
}
