extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:history/samurai_layer1",
    "layer2": "tmhp:history/samurai_layer2",
    "katana": "tmhp:history/samurai_katana",
    "sheath": "tmhp:history/samurai_sheath",
    "arrow": "tmhp:assassin/weapons/arrow",
    "quiver": "tmhp:assassin/weapons/quiver",
    "bow": "tmhp:assassin/weapons/bow"
});

var utils = implement("fiskheroes:external/utils");
var sheath;

function init(renderer) {
    parent.init(renderer);
}
function initEffects(renderer) {
    utils.addLivery(renderer, "KATANA", "katana");
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
    utils.addLivery(renderer, "COMPOUND_BOW", "bow");

    sheath = renderer.createEffect("fiskheroes:model");
    sheath.setModel(utils.createModel(renderer, "tmhp:scorpion_sheath", "sheath", null));
    sheath.anchor.set("body");
    sheath.mirror = false;

    renderer.bindProperty("fiskheroes:equipped_item").setItems([
        { "anchor": "body", "scale": 0.4, "offset": [4.7, 13.5, -3.2], "rotation": [-102.0, 0.0, 0.0] }
    ]);

}
function render(entity, renderLayer, isFirstPersonArm) {
    var anchor = sheath.anchor.set("body");
    var offSet = sheath.setOffset(-9.5, 0, 0.0);
    var rot = sheath.setRotation(0.0, 0.0, 0.0);
    sheath.anchor = anchor, offSet, rot;
    sheath.render();
}