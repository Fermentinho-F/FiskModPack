extend("tmhp:hero_mask");
loadTextures({
    "layer1": "tmhp:dc/flashfamily/xs_layer1",
    "layer2": "tmhp:dc/flashfamily/xs_layer2"
});

var speedster = implement("tmhp:external/speedster_utils");
var utils = implement("fiskheroes:external/utils");
var chest;

function init(renderer) {
    parent.init(renderer);
}
function initEffects(renderer) {
    speedster.init(renderer);
    utils.bindTrail(renderer, "tmhp:xs_1").setCondition(entity => entity.getData("fiskheroes:speeding"));
    utils.bindTrail(renderer, "tmhp:xs_2").setCondition(entity => entity.getData("fiskheroes:speeding"));

    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0x9901FF, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "fiskheroes:energy_discharge", "rightArm", 0xFFD53A, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.5, 1.5] }
    ]);

    chest = renderer.createEffect("fiskheroes:chest");
    chest.setExtrude(0.6).setYOffset(1.0);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        chest.render();
    }
}