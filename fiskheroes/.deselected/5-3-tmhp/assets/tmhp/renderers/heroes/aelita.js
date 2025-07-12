extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:lyoko_warriors/aelita_layer1",
    "layer2": "tmhp:lyoko_warriors/aelita_layer2",
    "wings": "tmhp:lyoko_warriors/aelita_wings"
});

var utils = implement("fiskheroes:external/utils");
var spirit_wings = implement("tmhp:external/spirit_wings");
var wing;

function initEffects(renderer) {
    renderer.bindProperty("fiskheroes:energy_bolt").color.set(0xFF55FF);
    wing = spirit_wings.create(renderer, null, "wings", spirit_wings.AELITA);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);

    utils.addFlightAnimation(renderer, "mmc.FLIGHT", "fiskheroes:flight/martian_comics.anim.json");
    utils.addHoverAnimation(renderer, "mmc.HOVER", "fiskheroes:flight/idle/martian_comics");
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (entity.getInterpolatedData("fiskheroes:flying")) {
        wing.render(entity, entity.getInterpolatedData("fiskheroes:shield_blocking_timer"));
    }
}
