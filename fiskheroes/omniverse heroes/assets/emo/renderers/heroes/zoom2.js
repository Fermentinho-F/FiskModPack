extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "fiskheroes:zoom_layer1",
    "layer2": "fiskheroes:zoom_layer2",
    "eyes": "fiskheroes:reverse_flash_eyes"
});

var utils = implement("fiskheroes:external/utils");
var speedster = implement("fiskheroes:external/speedster_utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" && entity.getData("fiskheroes:speeding") ? "eyes" : "null");

    renderer.setItemIcons("%s_0", "zoom2_1", "zoom2_2", "zoom2_3");
}

function initEffects(renderer) {
    speedster.init(renderer, "emo:lightning_nz");
    vibration = renderer.createEffect("fiskheroes:vibration");

    utils.bindBeam(renderer, "fiskheroes:lightning_cast", "fiskheroes:lightning_cast", "rightArm", 0xFF0000, [
        { "firstPerson": [-8.0, 4.5, -10.0], "offset": [-0.5, 9.0, 0.0], "size": [0.75, 0.75] }
    ]);
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getData("fiskheroes:speeding")) {
        vibration.render();
    }
}
