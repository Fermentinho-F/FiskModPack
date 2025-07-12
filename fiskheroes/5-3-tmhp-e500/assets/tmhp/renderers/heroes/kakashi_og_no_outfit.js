extend("tmhp:kakashi_og");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "headband": "tmhp:null",
    "headbandfix": "tmhp:null"
});

var sharingan_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}
function initEffects(renderer) {
    parent.initEffects(renderer);
    sharingan_display = renderer.createEffect("fiskheroes:overlay");
    sharingan_display.texture.set("sharingan");
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (entity.is("DISPLAY")) {
        sharingan_display.render();
   }
}