extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "swhp:clone_trooper_phase1/clone_trooper_phase1_layer1",
    "layer2": "swhp:clone_trooper_phase1/clone_trooper_phase1_layer2"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
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
