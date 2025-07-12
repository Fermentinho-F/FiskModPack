extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:anime/zoro_prets_layer1",
    "layer2": "tmhp:anime/zoro_prets_layer2",
    "bandana": "tmhp:anime/zoro_prets_bandana",

    "sheath": "tmhp:anime/zoro_sheath",
    "shusui": "tmhp:anime/shusui",
    "sandai_kitetsu": "tmhp:anime/sandai_kitetsu",
    "wado_ichimonji": "tmhp:anime/wado_ichimonji"
});

var utils = implement("fiskheroes:external/utils");
var sheath;
var shusui;
var sandai_kitetsu;
var wado_ichimonji;
function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (renderLayer == "CHESTPLATE" && !entity.getData("fiskheroes:mask_open_timer2")) {
            return "layer1";
        }
        if (renderLayer == "CHESTPLATE" && entity.getData("fiskheroes:mask_open_timer2")) {
            return "bandana";
        }
        return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
    });

    renderer.fixHatLayer("CHESTPLATE");
    renderer.showModel("CHESTPLATE", "head", "headwear", "body", "rightArm", "leftArm");
}
function initAnimations(renderer) {
    renderer.removeCustomAnimation("basic.BLOCKING");

    addAnimation(renderer, "basic.BLOCKING", "tmhp:zoro_block").setData((entity, data) => {
        var charge = entity.getInterpolatedData("fiskheroes:shield_blocking_timer");
        data.load(Math.max(entity.getInterpolatedData("fiskheroes:shield_blocking_timer"), entity.getData("fiskheroes:shield_blocking") ? Math.min(charge * 3, 1) : Math.max(charge * 5 - 4, 0)));
    });
    addAnimationWithData(renderer, "zoro.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:blade_timer");
}
function initEffects(renderer) {
    shusui = renderer.createEffect("fiskheroes:model");
    shusui.setModel(utils.createModel(renderer, "tmhp:shusui", "shusui", null));
    shusui.anchor.set("rightArm");
    shusui.mirror = false;
    sandai_kitetsu = renderer.createEffect("fiskheroes:model");
    sandai_kitetsu.setModel(utils.createModel(renderer, "tmhp:sandai_kitetsu", "sandai_kitetsu", null));
    sandai_kitetsu.anchor.set("leftArm");
    sandai_kitetsu.mirror = false;
    wado_ichimonji = renderer.createEffect("fiskheroes:model");
    wado_ichimonji.setModel(utils.createModel(renderer, "tmhp:wado_ichimonji", "wado_ichimonji", null));
    wado_ichimonji.anchor.set("head");
    wado_ichimonji.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "tmhp:slash", "rightArm", 0x0088FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.0, 11.0] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:slash", "rightArm", 0x0088FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 10.0, -12.0], "size": [1.0, 50.0] }
    ]);
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getInterpolatedData("fiskheroes:blade")) {
        shusui.opacity = entity.getInterpolatedData("fiskheroes:blade");
        shusui.render();
        sandai_kitetsu.opacity = entity.getInterpolatedData("fiskheroes:blade");
        sandai_kitetsu.render();
        wado_ichimonji.opacity = entity.getInterpolatedData("fiskheroes:blade");
        wado_ichimonji.render();
    }
}