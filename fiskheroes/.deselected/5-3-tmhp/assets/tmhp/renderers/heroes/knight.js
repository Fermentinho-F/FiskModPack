extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:history/knight_layer1",
    "layer2": "tmhp:history/knight_layer2",
    "sword": "tmhp:history/knight_sword",
    "cape": "tmhp:history/knight_cape",
    "arrow": "tmhp:assassin/weapons/arrow",
    "quiver": "tmhp:assassin/weapons/quiver",
    "bow": "tmhp:assassin/weapons/bow"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");

var sword;
var cape;

function init(renderer) {
    parent.init(renderer);
}
function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.99;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "tmhp:sword", "sword"));
    sword.anchor.set("rightArm");
    sword.mirror = false;

    utils.addLivery(renderer, "ARROW", "arrow");
    utils.addLivery(renderer, "QUIVER", "quiver");
    utils.addLivery(renderer, "COMPOUND_BOW", "bow");
}
function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "his.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:shield_timer");
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    sword.opacity = entity.getInterpolatedData("fiskheroes:shield");
    sword.render();
}