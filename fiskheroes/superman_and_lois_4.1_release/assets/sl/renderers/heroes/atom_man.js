extend("fiskheroes:hero_basic");
loadTextures({
    "coat": "sl:atom_man_coat",
    "helmet": "sl:atom_man_helmet",
    "boots": "sl:atom_man_boots",
    "underwear": "sl:underwear",
    "null": "sl:null",
    "backpack_texture": "sl:fuel_tank_backpack"
});

var utils = implement("fiskheroes:external/utils");
var backpack;

function init(renderer) {
    parent.init(renderer);
    
renderer.setTexture((entity, renderLayer) => {
    if (renderLayer === "LEGGINGS") {
        if (entity.getWornChestplate().suitType() === $SUIT_NAME) {
            return "null";
        } else {
            return "underwear";
        }
    } else if (renderLayer === "CHESTPLATE") {
        return "coat";
    } else if (renderLayer === "HELMET") {
        return "helmet";
    } else if (renderLayer === "BOOTS") {
        return "boots";
    } else {
        return "null";
    }
    });

    renderer.showModel("CHESTPLATE", "head", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initEffects(renderer) {
    backpack = renderer.createEffect("fiskheroes:model");
    backpack.setModel(utils.createModel(renderer, "sl:fuel_backpack", "backpack_texture"));
    backpack.anchor.set("body");

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "chest", "scale": 0.6, "offset": [-5.0, 10.5, 1.25], "rotation": [87.0, 0.0, 0.0] }
    ]).slotIndex = 0;
}

function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        backpack.render();
    }
}
