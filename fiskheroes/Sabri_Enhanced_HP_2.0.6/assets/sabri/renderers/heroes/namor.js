extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sabri:namor_layer1",
    "layer2": "sabri:namor_layer2",
    "wings": "sabri:namor_wings"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    renderer.setTexture((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer2" : "layer1");

    renderer.setItemIcons("%s_0", "%s_1", "%s_2", "%s_3");
    renderer.showModel("HELMET", "head", "headwear");
    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm");
    renderer.showModel("LEGGINGS", "body", "rightLeg", "leftLeg");
    renderer.showModel("BOOTS", "rightLeg", "leftLeg");

    initEffects(renderer);
    initAnimations(renderer);
}

function initEffects(renderer) {
    var model = renderer.createResource("MODEL", "sabri:namor_wings");
    model.bindAnimation("sabri:flight/namor_wings")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("sabri:dyn/in_water")
            data.load(0, Math.max(entity.loop(2) * (1 - f), 0));
            data.load(1, Math.max(entity.getInterpolatedData("fiskheroes:flight_timer") - f, 0));
        });

    model.texture.set("wings");
    wings = renderer.createEffect("fiskheroes:model").setModel(model);
    wings.anchor.set("rightLeg");
    wings.setOffset(0, -13, 0);

    wings2 = renderer.createEffect("fiskheroes:model").setModel(model);
    wings2.anchor.set("leftLeg");
    wings2.setOffset(0, -13, 0);

    vision = renderer.bindProperty("fiskheroes:night_vision");
    vision.factor = 10;
    vision.fogStrength = -10;
    vision.underwaterOnly = true;
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "namor.POSE", "sabri:spear_pose", "sabri:dyn/sneak_timer");

    addAnimationWithData(renderer, "namor.ROLL", "fiskheroes:flight/barrel_roll", "fiskheroes:barrel_roll_timer")
        .priority = 10;

    utils.addFlightAnimation(renderer, "namor.FLIGHT", "sabri:flight/namor.anim.json");
    utils.addHoverAnimation(renderer, "namor.HOVER", "sabri:flight/idle/namor");
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "BOOTS") {
        wings.render();
        wings2.render();
    }
}