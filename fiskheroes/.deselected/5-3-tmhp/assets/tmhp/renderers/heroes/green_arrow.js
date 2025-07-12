extend("tmhp:hero_mask2");
loadTextures({
    "hood_open": "tmhp:dc/green_arrow/default/hood_open",
    "mask": "tmhp:dc/green_arrow/default/mask",
    "layer1": "tmhp:dc/green_arrow/default/layer1",
    "layer2": "tmhp:dc/green_arrow/default/layer2",
    "arrow": "tmhp:dc/green_arrow/default/arrow",
    "quiver": "tmhp:dc/green_arrow/default/quiver"
});

var utils = implement("fiskheroes:external/utils");

function initEffects(renderer) {
    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimation(renderer, "scout.ROLL", "fiskheroes:falcon_dive_roll")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
            data.load(f > 0 ? Math.min((1 - f) * 2.5, 1) : 0);
        });
}