extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:deadpool_layer1",
    "layer2": "zaro:deadpool_layer2",
    "scabbard": "fiskheroes:deadpool_xmen_scabbard",
    "katana": "zaro:deadpool_katana",
    "gun": "zaro:deadpool_gun"
});

var utils = implement("fiskheroes:external/utils");

var scabbard;

function init(renderer) {
    parent.init(renderer);
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x6EFF00);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-3.5, 2.0, 3.0], "rotation": [0.0, -90.0, 60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 3.0);

      scabbard = renderer.createEffect("fiskheroes:model");
    scabbard.setModel(utils.createModel(renderer, "fiskheroes:deadpool_scabbard", "scabbard"));
    scabbard.anchor.set("body");

    utils.addLivery(renderer, "KATANA", "katana");
    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.535, "offset": [-3.05, 0.52, 3.0], "rotation": [-148.0, 90.0, 0.0] },
        { "anchor": "body", "scale": 0.535, "offset": [3.05, 0.52, 3.0], "rotation": [-148.0, -90.0, 0.0] }
    ]).slotIndex = 0;
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;
}
