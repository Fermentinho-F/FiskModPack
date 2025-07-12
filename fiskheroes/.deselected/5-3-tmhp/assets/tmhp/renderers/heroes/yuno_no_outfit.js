extend("tmhp:yuno");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "hood_open": "tmhp:null",
    "spiritdive": "tmhp:black_clover/yuno/no_outfit_spiritdive",
    "grimoire_pocket": "tmhp:null",
    "cape": "tmhp:null"
});

var spiritdive_display;
var wing_display;
var crown_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    spiritdive_display = renderer.createEffect("fiskheroes:overlay");
    spiritdive_display.texture.set(null, "spiritdive");
    wing_display = renderer.createEffect("fiskheroes:wings");
    wing_display.texture.set(null, "wing");
    wing_display.anchor.set("body");
    crown_display = renderer.createEffect("fiskheroes:model");
    crown_display.setModel(utils.createModel(renderer, "tmhp:black_clover/spirit_crown", null, "crown"));
    crown_display.anchor.set("head");
    crown_display.mirror = false;
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (renderLayer == "CHESTPLATE") {
        spiritdive_display.opacity = entity.is("DISPLAY");
        spiritdive_display.render();
        crown_display.opacity = entity.is("DISPLAY");
        crown_display.render();
        wing_display.opacity = entity.is("DISPLAY");
        wing_display.unfold = entity.is("DISPLAY");
        wing_display.render();
    }
}