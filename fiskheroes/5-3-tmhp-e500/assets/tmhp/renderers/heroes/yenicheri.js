extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:history/yenicheri_layer1",
    "layer2": "tmhp:history/yenicheri_layer2",
    "fes": "tmhp:history/yenicheri_fes",
    "sword": "tmhp:history/yenicheri_sword",
    "arrow": "tmhp:assassin/weapons/arrow",
    "quiver": "tmhp:assassin/weapons/quiver",
    "bow": "tmhp:assassin/weapons/bow"
});

var utils = implement("fiskheroes:external/utils");

var sword;
var fes;

function initEffects(renderer) {
    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "tmhp:kilic", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
    utils.addLivery(renderer, "COMPOUND_BOW", "bow");

    fes = renderer.createEffect("fiskheroes:opening_mask");
    fes.texture.set("fes");
    fes.anchor.set("head");
    fes.setOffset(0.0, -2.0, 0.0).setRotation(0.0, 0.0, 0.0);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "his.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:shield_timer");
}

function render(entity, renderLayer, isFirstPersonArm) {
    sword.opacity = entity.getInterpolatedData("fiskheroes:shield");
    sword.render();
    if (renderLayer == "HELMET") {
        fes.render();
    }
}