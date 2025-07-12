extend("tmhp:naruto_og");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "headband": "tmhp:null"
});

var red_eyes_display;
var head_display;
var body_display;
var tail_display;
var arm_display;
var leg_display;

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

    body_display = renderer.createEffect("fiskheroes:model");
    body_display.setModel(utils.createModel(renderer, "tmhp:one_tail/tail", "tail", null));
    body_display.anchor.set("body");
    body_display.mirror = false;

    tail_display = renderer.createEffect("fiskheroes:model");
    tail_display.setModel(utils.createModel(renderer, "tmhp:one_tail/body", "body", null));
    tail_display.anchor.set("body");
    tail_display.mirror = false;

    arm_display = renderer.createEffect("fiskheroes:model");
    arm_display.setModel(utils.createModel(renderer, "tmhp:one_tail/arm", "body", null));
    arm_display.anchor.set("rightArm");
    arm_display.mirror = true;

    leg_display = renderer.createEffect("fiskheroes:model");
    leg_display.setModel(utils.createModel(renderer, "tmhp:one_tail/leg", "body", null));
    leg_display.anchor.set("rightLeg");
    leg_display.mirror = true;
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (entity.is("DISPLAY")) {
        red_eyes_display.render();
        head_display.opacity = 0.5;
        head_display.render();
        body_display.opacity = 0.5;
        body_display.render();
        tail_display.opacity = 0.5;
        tail_display.render();
        arm_display.opacity = 0.5;
        arm_display.render();
        leg_display.opacity = 0.5;
        leg_display.render();
   }
}