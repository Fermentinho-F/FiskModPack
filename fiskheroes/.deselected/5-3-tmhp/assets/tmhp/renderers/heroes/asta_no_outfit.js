extend("tmhp:asta");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "hood_open": "tmhp:null",
    "grimoire_pocket": "tmhp:null",
    "mask": "tmhp:null",
    "blackform": "tmhp:black_clover/asta/no_outfit_blackform"
});

var blackform_display;
var wing_display;
var horn_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    blackform_display = renderer.createEffect("fiskheroes:overlay");
    blackform_display.texture.set("blackform", null);
    wing_display = renderer.createEffect("fiskheroes:wings");
    wing_display.texture.set("wing", null);
    wing_display.anchor.set("body");
    horn_display = renderer.createEffect("fiskheroes:model");
    horn_display.setModel(utils.createModel(renderer, "tmhp:black_clover/devil_horn", "horn", null));
    horn_display.anchor.set("head");
    horn_display.mirror = false;
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (entity.is("DISPLAY")) {
        blackform_display.render();
        horn_display.render();
        wing_display.render();
    }
}