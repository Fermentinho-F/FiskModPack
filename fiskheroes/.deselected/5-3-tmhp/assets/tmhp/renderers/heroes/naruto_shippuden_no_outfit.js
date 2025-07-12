extend("tmhp:naruto_shippuden");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "headband": "tmhp:null"
});

var red_eyes_display;
var head_display;
var body_display;
var tail_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    red_eyes_display = renderer.createEffect("fiskheroes:overlay");
    red_eyes_display.texture.set("rage");

    head_display = renderer.createEffect("fiskheroes:model");
    head_display.setModel(utils.createModel(renderer, "tmhp:one_tail/head", "head", null));
    head_display.anchor.set("head");
    head_display.mirror = false;

    body_display = renderer.createEffect("fiskheroes:overlay");
    body_display.texture.set("body");

    tail_display = renderer.createEffect("fiskheroes:model");
    tail_display.setModel(utils.createModel(renderer, "tmhp:one_tail/four_tails", "tail", null));
    tail_display.anchor.set("body");
    tail_display.mirror = false;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (entity.is("DISPLAY")) {
        red_eyes_display.render();
        head_display.render();
        body_display.render();
        tail_display.render();
   }
}