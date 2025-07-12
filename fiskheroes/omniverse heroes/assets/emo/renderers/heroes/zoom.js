extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "emo:zoom",
    "layer2": "emo:zoom",
    "eyes": "emo:yok"
});

var utils = implement("fiskheroes:external/utils");

var vibration;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" && entity.getData("fiskheroes:mask_open") ? "eyes" : null);
}

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    utils.bindTrail(renderer, "fiskheroes:lightning_red");
    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xFF0000, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!entity.isDisplayStand() && entity.getData("fiskheroes:mask_open")) {
        vibration.render();
    }
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimation(renderer, "zoom.SPRINT", "emo:speed/speed_glitch").setData((entity, data) => data.load(Math.max(entity.isSprinting() && Math.random() < 0.5)))
    .priority = 1;
    addAnimation(renderer, "zoom.SPRINT1", "emo:speed/speed_glitch1").setData((entity, data) => data.load(Math.max(entity.isSprinting() && Math.random() < 0.5)))
    .priority = 1;
}