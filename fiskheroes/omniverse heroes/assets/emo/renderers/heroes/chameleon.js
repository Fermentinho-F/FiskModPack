extend("fiskheroes:hero_basic");
loadTextures({
    "jacket": "emo:chameleon",
    "pants": "emo:chameleon",
    "boots": "emo:chameleon",
    "gun": "fiskheroes:deathstroke_dceu_gun",
});

var utils = implement("fiskheroes:external/utils");

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => renderLayer == "LEGGINGS" ? "pants" : renderLayer == "BOOTS" ? "boots" : "jacket");

    renderer.showModel("CHESTPLATE", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    utils.addLivery(renderer, "DESERT_EAGLE", "gun");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-2.4, 0.5, 1.25], "rotation": [90.0, 0.0, 0.0] }
    ]).slotIndex = 1;
}

