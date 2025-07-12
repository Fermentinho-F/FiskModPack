extend("tmhp:hero_phantom");
loadTextures({
    "suit":   "tmhp:phantoms/danny/danny_suit.tx.json",
    "base":   "tmhp:phantoms/danny/danny_phantom_base",
    "ice_hands": "tmhp:phantoms/ice_hands"
});

var ice_hands;

function initEffects(renderer) {
    parent.initEffects(renderer);
    ice_hands = renderer.createEffect("fiskheroes:overlay");
    ice_hands.texture.set(null, "ice_hands");

    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));
}
function render(entity, renderLayer, isFirstPersonArm) {
    parent.render(entity, renderLayer, isFirstPersonArm);
        ice_hands.opacity = entity.getInterpolatedData("fiskheroes:cryo_charge");
        ice_hands.render();
}