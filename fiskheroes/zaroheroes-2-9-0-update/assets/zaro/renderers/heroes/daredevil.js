extend("fiskheroes:spider_man_base");
loadTextures({
    "layer1": "zaro:daredevil",
    "layer2": "zaro:daredevil"
});
var utils = implement("fiskheroes:external/utils");


function init(renderer) {
    parent.init(renderer);
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
    renderer.fixHatLayer("HELMET", "CHESTPLATE");
}
function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "rightLeg", "scale": 0.7, "offset": [-1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] },
        { "anchor": "leftLeg", "scale": 0.7, "offset": [1.8, 0.75, -0.5], "rotation": [110.0, 0.0, 0.0] }
    ]);
}
