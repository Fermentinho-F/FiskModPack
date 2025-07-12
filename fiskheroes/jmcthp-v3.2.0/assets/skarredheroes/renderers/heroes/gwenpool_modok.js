extend("skarredheroes:gwenpool");
loadTextures({
    "layer1": "skarredheroes:gwenpool/gwenpool_modok_layer1",
    "backpack": "skarredheroes:gwenpool/modok_pack"
});
var utils = implement("fiskheroes:external/utils");

var backpack;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("gwenpool_0", "%s_1", "gwenpool_2", "gwenpool_3")
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    var modelPack = renderer.createResource("MODEL", "skarredheroes:modok_pack");
    modelPack.texture.set("backpack");
    backpack = renderer.createEffect("fiskheroes:model").setModel(modelPack);
    backpack.anchor.set("body");
	backpack.setScale(1.2);
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (renderLayer == "CHESTPLATE" && !isFirstPersonArm) {
        backpack.render();
	}
}