extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:black_widow_layer1",
    "layer2": "sabri:black_widow_layer2",
    "chest": "sabri:black_widow_chest",
    "bite": "sabri:black_widow_bite",
    "backpack": "sabri:black_widow_backpack",
    "grappling_rope": "sabri:black_widow_grappling_rope",
    "grappling_hook": "sabri:black_widow_grappling_hook"
});

var utils = implement("fiskheroes:external/utils");

var chest;
var backpack;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => renderLayer == "CHESTPLATE" ? "chest" : renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-3.5, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 0;

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-2.9, -1.15, 3.05], "rotation": [0.0, 0.0, 147.5] },
        { "anchor": "body", "scale": 0.7, "offset": [2.9, -1.15, 3.05], "rotation": [0.0, 0.0, -147.5] }
    ]).slotIndex = 1;

    utils.bindBeam(renderer, "fiskheroes:repulsor_blast", "sabri:black_widow_bite", "rightArm", 0x34BED1, [
        { "firstPerson": [-4.0, 2.5, -7.0], "offset": [-2.6, 6.0, 0.0], "size": [0.5, 0.5] }
    ]);

    var grappling = renderer.bindProperty("fiskheroes:webs");

    grappling.textureRope.set("grappling_rope");
    grappling.textureRopeBase.set("grappling_hook");

    bite = renderer.createEffect("fiskheroes:overlay");
    bite.texture.set(null, "bite");

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(1).setYOffset(1);

    backpack = renderer.createEffect("fiskheroes:model");
    backpack.setModel(utils.createModel(renderer, "sabri:black_widow_backpack", "backpack"));
    backpack.anchor.set("body");
    backpack.setOffset(0, -14, 4);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.AIMING");

    utils.addAnimationEvent(renderer, "WEBSWING_DEFAULT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_RIGHT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_LEFT", "fiskheroes:swing_default");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_RIGHT", "fiskheroes:web_swing_shoot_right");
    utils.addAnimationEvent(renderer, "WEBSWING_SHOOT_LEFT", "fiskheroes:web_swing_shoot_left");

    addAnimationWithData(renderer, "black_widow.LAND", "fiskheroes:superhero_landing", "fiskheroes:dyn/superhero_landing_timer")
        .priority = -8;

    addAnimationWithData(renderer, "black_widow.BATONS", "sabri:black_widow_batons", "sabri:dyn/baton_timer")
        .priority = -8;

    addAnimation(renderer, "basic.AIMING", "fiskheroes:aiming") 
		.setData((entity, data) => {
		data.load(Math.max(entity.getInterpolatedData("sabri:dyn/grapple_cooldown"), entity.getInterpolatedData("fiskheroes:aiming_timer")));
    });
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        chest.render();
        backpack.render();
        bite.opacity = (entity.getInterpolatedData("sabri:dyn/aiming_timer") + entity.getInterpolatedData("fiskheroes:aiming_timer")) / 2;
        bite.render();
    }
}
