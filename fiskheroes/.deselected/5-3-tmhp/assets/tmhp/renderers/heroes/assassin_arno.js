extend("tmhp:hero_assassin");
loadTextures({
    "mask": "tmhp:assassin/arno_mask_open",
    "chest": "tmhp:assassin/arno_chest",
    "legs": "tmhp:assassin/arno_legs",
    "boots": "tmhp:assassin/arno_boots",
    "hidden_blade": "tmhp:assassin/weapons/hidden_blade",
    "phantom_bow": "tmhp:assassin/weapons/phantom_bow"
});
var phantom_bow;

function initEffects(renderer) {
    parent.initEffects(renderer);

    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0x772255);

    phantom_bow = renderer.createEffect("fiskheroes:shield");
    phantom_bow.texture.set("phantom_bow");
    phantom_bow.anchor.set("rightArm");
    phantom_bow.setCurve(0.0, 0.0);
}

function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
    if (renderLayer == "CHESTPLATE") {
        phantom_bow.unfold = entity.getInterpolatedData("fiskheroes:aimed_timer");
        phantom_bow.setOffset(-2.0, 8.5, -0.5);
        phantom_bow.render();
    }
}