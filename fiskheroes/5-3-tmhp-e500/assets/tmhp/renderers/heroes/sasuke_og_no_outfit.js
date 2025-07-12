extend("tmhp:sasuke_og");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "headband": "tmhp:null",
    "curse_mark": "tmhp:naruto_verse/sasuke/curse_mark_no_outfit"
});

var sharingan_display;
var curse_mark_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    sharingan_display = renderer.createEffect("fiskheroes:overlay");
    sharingan_display.texture.set("sharingan");
    curse_mark_display = renderer.createEffect("fiskheroes:overlay");
    curse_mark_display.texture.set("curse_mark");

    curse_mark_hand_display = renderer.createEffect("fiskheroes:model");
    curse_mark_hand_display.setModel(utils.createModel(renderer, "tmhp:curse_mark", "curse_mark_hand", null));
    curse_mark_hand_display.anchor.set("body");
    curse_mark_hand_display.mirror = false;
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (entity.is("DISPLAY")) {
     sharingan_display.render();
     curse_mark_display.render();
     curse_mark_hand_display.render();
  }
}