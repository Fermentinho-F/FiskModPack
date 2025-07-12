extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:games/mortal_kombat/sub_zero_layer1",
    "layer2": "tmhp:games/mortal_kombat/sub_zero_layer2",

    "ice": "tmhp:games/mortal_kombat/sub_zero_ice",
    "hammer": "tmhp:games/mortal_kombat/sub_zero_hammer"
});

var utils = implement("fiskheroes:external/utils");

var ice;
var hammer;

function initEffects(renderer) {
    ice = renderer.createEffect("fiskheroes:overlay");
    ice.texture.set("ice");

    hammer = renderer.createEffect("fiskheroes:model");
    hammer.setModel(utils.createModel(renderer, "tmhp:hammer", null, "hammer"));
    hammer.anchor.set("rightArm");
    hammer.mirror = false;

    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));
    utils.bindCloud(renderer, "fiskheroes:teleportation", "tmhp:ice_tp");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "strange.SWORD_POSE", "fiskheroes:sword_pose", "fiskheroes:blade_timer");
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (renderLayer == "CHESTPLATE") {
        hammer.opacity = entity.getInterpolatedData("fiskheroes:blade");
        hammer.render();
    }
    ice.opacity = entity.getData('fiskheroes:cryo_charge') || entity.is("DISPLAY");
    ice.render();
}