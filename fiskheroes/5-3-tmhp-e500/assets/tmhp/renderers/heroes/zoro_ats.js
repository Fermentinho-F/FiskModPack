extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:anime/zoro_ats_layer1",
    "layer2": "tmhp:anime/zoro_ats_layer2",
    "bandana": "tmhp:anime/zoro_ats_bandana",

    "sheath": "tmhp:anime/zoro_sheath",
    "shusui": "tmhp:anime/shusui",
    "sandai_kitetsu": "tmhp:anime/sandai_kitetsu",
    "wado_ichimonji": "tmhp:anime/wado_ichimonji",
    "haki_shusui": "tmhp:anime/haki_shusui",
    "haki_sandai_kitetsu": "tmhp:anime/haki_sandai_kitetsu",
    "haki_wado_ichimonji": "tmhp:anime/haki_wado_ichimonji"
});

var utils = implement("fiskheroes:external/utils");
var sheath;
var shusui;
var sandai_kitetsu;
var wado_ichimonji;
var haki_shusui;
var haki_sandai_kitetsu;
var haki_wado_ichimonji;

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

    haki_shusui = renderer.createEffect("fiskheroes:model");
    haki_shusui.setModel(utils.createModel(renderer, "tmhp:shusui", "haki_shusui", null));
    haki_shusui.anchor.set("rightArm");
    haki_shusui.mirror = false;
    haki_sandai_kitetsu = renderer.createEffect("fiskheroes:model");
    haki_sandai_kitetsu.setModel(utils.createModel(renderer, "tmhp:sandai_kitetsu", "haki_sandai_kitetsu", null));
    haki_sandai_kitetsu.anchor.set("leftArm");
    haki_sandai_kitetsu.mirror = false;
    haki_wado_ichimonji = renderer.createEffect("fiskheroes:model");
    haki_wado_ichimonji.setModel(utils.createModel(renderer, "tmhp:wado_ichimonji", "haki_wado_ichimonji", null));
    haki_wado_ichimonji.anchor.set("head");
    haki_wado_ichimonji.mirror = false;

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "tmhp:slash", "rightArm", 0x0088FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.0, 11.0] }
    ]).setCondition(entity => !entity.getInterpolatedData("tmhp:dyn/haki"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:slash", "rightArm", 0x0088FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 10.0, -12.0], "size": [1.0, 50.0] }
    ]).setCondition(entity => !entity.getInterpolatedData("tmhp:dyn/haki"));

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "tmhp:slash", "rightArm", 0x555555, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.0, 11.0] }
    ]).setCondition(entity => entity.getInterpolatedData("tmhp:dyn/haki"));

    utils.bindBeam(renderer, "fiskheroes:charged_beam", "tmhp:slash", "rightArm", 0x555555, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 10.0, -12.0], "size": [1.0, 50.0] }
    ]).setCondition(entity => entity.getInterpolatedData("tmhp:dyn/haki"));
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getInterpolatedData("fiskheroes:blade") && !entity.getInterpolatedData("tmhp:dyn/haki")) {
        shusui.opacity = entity.getInterpolatedData("fiskheroes:blade");
        shusui.render();
        sandai_kitetsu.opacity = entity.getInterpolatedData("fiskheroes:blade");
        sandai_kitetsu.render();
        wado_ichimonji.opacity = entity.getInterpolatedData("fiskheroes:blade");
        wado_ichimonji.render();
    }
    if (entity.getInterpolatedData("fiskheroes:blade") && entity.getInterpolatedData("tmhp:dyn/haki")) {
        haki_shusui.opacity = entity.getInterpolatedData("fiskheroes:blade") && entity.getInterpolatedData("tmhp:dyn/haki");
        haki_shusui.render();
        haki_sandai_kitetsu.opacity = entity.getInterpolatedData("fiskheroes:blade") && entity.getInterpolatedData("tmhp:dyn/haki");
        haki_sandai_kitetsu.render();
        haki_wado_ichimonji.opacity = entity.getInterpolatedData("fiskheroes:blade") && entity.getInterpolatedData("tmhp:dyn/haki");
        haki_wado_ichimonji.render();
    }
}