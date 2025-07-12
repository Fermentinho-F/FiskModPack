extend("tmhp:asta_spade");
loadTextures({
    "layer1": "tmhp:black_clover/asta/spade_no_outfit_layer1",
    "layer2": "tmhp:null",
    "grimoire_pocket": "tmhp:null",
    "mask": "tmhp:null",
    "blackform": "tmhp:black_clover/asta/spade_no_outfit_blackform"
});

var black_guardian_display;
var wings_display;
var du_horn_display;
var du_orbs_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}

function initEffects(renderer) {
    parent.initEffects(renderer);
    black_guardian_display = renderer.createEffect("fiskheroes:overlay");
    black_guardian_display.texture.set("black_guardian", "black_guardian_glow");

    wings_display = renderer.createEffect("fiskheroes:wings");
    wings_display.texture.set("wings", null);
    wings_display.anchor.set("body");
    du_horn_display = renderer.createEffect("fiskheroes:model");
    du_horn_display.setModel(utils.createModel(renderer, "tmhp:black_clover/devil_union_horn", "horn", null));
    du_horn_display.anchor.set("head");
    du_horn_display.mirror = false;
    du_orbs_display = renderer.createEffect("fiskheroes:model");
    du_orbs_display.setModel(utils.createModel(renderer, "tmhp:black_clover/orbs", "orbs", null));
    du_orbs_display.anchor.set("body");
    du_orbs_display.mirror = false;
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (entity.is("DISPLAY")) {
        black_guardian_display.render();
        wings_display.render();
        du_horn_display.render();
        du_orbs_display.render();
    }
}