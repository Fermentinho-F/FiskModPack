extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "zaro:nick_fury",
    "layer2": "zaro:nick_fury"
});

var utils = implement("fiskheroes:external/utils");


function init(renderer) {
   parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => renderLayer == "HELMET" || renderLayer == "LEGGINGS" ? "layer2" : "layer1");
    
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("CHESTPLATE");
}

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x6EFF00);
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.7, "offset": [-3.5, 2.0, 3.0], "rotation": [0.0, -90.0, 60.0] }
    ]).addOffset("QUIVER", 0.0, 0.0, 3.0);
   
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] }
    ]);
}
