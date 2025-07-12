extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:dc/batfamily/deadshot/layer1",
    "layer2": "tmhp:dc/batfamily/deadshot/layer2",
    "rifle": "tmhp:dc/batfamily/deadshot/rifle"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    parent.initEffects(renderer);
    utils.addLivery(renderer, "CHRONOS_RIFLE", "rifle");

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x000000);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-3.5, 2.0, 3.0], "rotation": [0.0, -90.0, 60.0] }
    ]).slotIndex = 0;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;
}
