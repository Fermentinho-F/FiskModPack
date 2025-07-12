extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:republic_commando/republic_commando_layer1",
    "layer2": "swhp:republic_commando/republic_commando_layer2",
    "lights": "swhp:republic_commando/republic_commando_lights"

});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => renderLayer == "HELMET" ? "lights" : null);
    initEffects(renderer);
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x00FFFF);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.5, "offset": [-2.8, 0.5, 2.0], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 0;
}
