extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "jmctheroes:blank",
    "layer2": "jmctheroes:blank",
    "model": "jmctheroes:big_wheel",
    "model_lights": "jmctheroes:big_wheel_lights"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {    
    utils.bindBeam(renderer, "fiskheroes:energy_projection", "jmctheroes:invisible", "body", 0x000000, [{"offset": [0.0, 3.0],"size": [2.0, 2.0]}]);

    var model = renderer.createResource("MODEL", "jmctheroes:BigWheel");
    model.texture.set("model", "model_lights");
    model.bindAnimation("jmctheroes:pose/big_wheel").setData((entity, data) => {
        data.load(0, entity.getInterpolatedData("jmctheroes:dyn/wheel_timer"));
        data.load(1, !entity.isDisplayStand() && entity.loop(50));
    });
    wheel = renderer.createEffect("fiskheroes:model").setModel(model);
    wheel.anchor.set("body");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    renderer.removeCustomAnimation("basic.BLOCKING");
    renderer.removeCustomAnimation("basic.ENERGY_PROJ");
    addAnimation(renderer, "big.WHEEL", "jmctheroes:pose/big_wheel_player").setData((entity, data) => {
        data.load(0, entity.isAlive());
    });
}
function render(entity, renderLayer, isFirstPersonArm) {
    // Is player, on holostand, or in book
    if (!entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType() === "HOLOGRAM" || entity.as("DISPLAY").getDisplayType() === "BOOK_PREVIEW") {
        if (isFirstPersonArm) {
            wheel.setOffset(0, 20, 4).setRotation(0, 0, 0);
            wheel.setScale(1.0);
        }
        else {
            wheel.setOffset(0, 20, 0).setRotation(0, 0, 0);
            wheel.setScale(1.0);
        }
    }
    else {
        if (entity.as("DISPLAY").getDisplayType() === "FABRICATOR_RESULT") {
            wheel.setOffset(0.0, 8.0, 1.75).setRotation(0, 90, 0);
            wheel.setScale(0.25);
        }
        else {
            wheel.setOffset(0.0, 0.0, 0.0).setRotation(0, 0, 0);
            wheel.setScale(1.0);
        }
    }
    wheel.anchor.ignoreAnchor(isFirstPersonArm);
    wheel.render();
}
