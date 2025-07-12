extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "sl:spartan_layer1",
    "layer2": "sl:spartan_layer2",
    "scabbard": "fiskheroes:deathstroke_dceu_scabbard",
    "gun": "sl:diggle_gun",
    "ammo_bag": "fiskheroes:deathstroke_dceu_ammo_bag",
    "lights": "sl:spartan_lights"
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setLights((entity, renderLayer) => {
        // Check if the "fiskheroes:mask_open" data is false or undefined
        if (!entity.getData("fiskheroes:mask_open")) {
            return renderLayer == "HELMET" ? "lights" : null;
        }
        return null;
    });
}

function initEffects(renderer) {
var nv = renderer.bindProperty("fiskheroes:night_vision");
nv.firstPersonOnly = true;
nv.factor = 0.2;

    utils.addLivery(renderer, "DESERT_EAGLE", "gun");
    utils.addLivery(renderer, "AMMO_BAG", "ammo_bag");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 0;
}
