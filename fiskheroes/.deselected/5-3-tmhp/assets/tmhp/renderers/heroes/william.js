extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:lyoko_warriors/william_layer1",
    "layer2": "tmhp:lyoko_warriors/william_layer2",

    "zweihander": "tmhp:lyoko_warriors/zweihander"
});

var utils = implement("fiskheroes:external/utils");
var zweihander;

function initEffects(renderer) {
    zweihander = renderer.createEffect("fiskheroes:model");
    zweihander.setModel(utils.createModel(renderer, "tmhp:zweihander", "zweihander", null));
    zweihander.anchor.set("rightArm");
    zweihander.mirror = false;

    utils.bindCloud(renderer, "fiskheroes:telekinesis", "tmhp:raven");

    utils.bindCloud(renderer, "fiskheroes:particle_cloud", "fiskheroes:shadow_smoke").setCondition(entity => entity.getData("fiskheroes:shadowform"));
    utils.bindBeam(renderer, "fiskheroes:energy_manipulation", "tmhp:slash", "rightArm", 0x555555, [
        { "firstPerson": [-2.5, 0.0, -7.0], "offset": [-0.5, 19.0, -12.0], "size": [1.0, 11.0] }
    ]);
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "zweihander.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:blade_timer");
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        zweihander.opacity = entity.getData("fiskheroes:blade");
        zweihander.render();
    }
}