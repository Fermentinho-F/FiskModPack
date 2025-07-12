extend("tmhp:naruto_sage");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "headband": "tmhp:null",
    "sagecoat": "tmhp:null"
});

var sage_eyes_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    sage_eyes_display = renderer.createEffect("fiskheroes:overlay");
    sage_eyes_display.texture.set("sage");
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (entity.is("DISPLAY")) {
        sage_eyes_display.render();
   }
}