extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "mordi:mustard_layer1",
    "layer2": "mordi:mustard_layer1",
    "lights_layer1": "mordi:mustard_lights_layer1",
    "lights_layer2": "mordi:mustard_lights_layer1",
    "gun": "fiskheroes:deathstroke_dceu_gun"
});

var utils = implement("fiskheroes:external/utils");

var scabbard;

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "lights_layer1" : "lights_layer1");
}
function initEffects(renderer) {
    scabbard = renderer.createEffect("fiskheroes:model");
    scabbard.anchor.set("body");

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
    ]).slotIndex = 0;

    night_vision = renderer.bindProperty("fiskheroes:night_vision");
	night_vision.firstPersonOnly = true;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        scabbard.render();
    }
}
