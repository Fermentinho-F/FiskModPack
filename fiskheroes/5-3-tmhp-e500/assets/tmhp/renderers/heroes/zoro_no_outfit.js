extend("tmhp:zoro");
loadTextures({
    "layer1": "tmhp:null",
    "layer2": "tmhp:null",
    "bandana": "tmhp:null",
    "sheath": "tmhp:null"
});

var shusui_display;
var sandai_kitetsu_display;
var wado_ichimonji_display;

function init(renderer) {
    parent.init(renderer);
    renderer.setItemIcons("no_outfit_0", "no_outfit_1", "no_outfit_2", "no_outfit_3");
}
function initEffects(renderer) {
    shusui_display = renderer.createEffect("fiskheroes:model");
    shusui_display.setModel(utils.createModel(renderer, "tmhp:shusui", "shusui", null));
    shusui_display.anchor.set("rightArm");
    shusui_display.mirror = false;
    sandai_kitetsu_display = renderer.createEffect("fiskheroes:model");
    sandai_kitetsu_display.setModel(utils.createModel(renderer, "tmhp:sandai_kitetsu", "sandai_kitetsu", null));
    sandai_kitetsu_display.anchor.set("leftArm");
    sandai_kitetsu_display.mirror = false;
    wado_ichimonji_display = renderer.createEffect("fiskheroes:model");
    wado_ichimonji_display.setModel(utils.createModel(renderer, "tmhp:wado_ichimonji", "wado_ichimonji", null));
    wado_ichimonji_display.anchor.set("head");
    wado_ichimonji_display.mirror = false;
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.is("DISPLAY")) {
        shusui_display.render();
        sandai_kitetsu_display.render();
        wado_ichimonji_display.render();
    }
}