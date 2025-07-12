extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "mordi:stain_layer1",
    "layer2": "mordi:stain_layer1",
    "layer1_lights": "mordi:stain_lights_layer1",
    "scabbard": "fiskheroes:deadpool_xmen_scabbard",
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "LEGGINGS" ? "layer1_lights" : "layer1_lights");
}

var scabbard;

function initEffects(renderer) {
    scabbard = renderer.createEffect("fiskheroes:model");
    scabbard.anchor.set("body");

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [3.05, 0.52, 3.0], "rotation": [-148.0, -90.0, 0.0] }
 ]).slotIndex = 0;
 renderer.bindProperty("fiskheroes:equipped_item").setItems([
     { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
 ]).slotIndex = 1;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
		scabbard.render();
    }
}

