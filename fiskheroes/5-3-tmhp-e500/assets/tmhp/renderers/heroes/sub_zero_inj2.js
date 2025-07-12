extend("fiskheroes:hero_basic");
loadTextures({
    "layer1": "tmhp:games/mortal_kombat/sub_zero_inj2_layer1",
    "layer2": "tmhp:games/mortal_kombat/sub_zero_inj2_layer2",
    "cape": "tmhp:games/mortal_kombat/sub_zero_cape",

    "ice": "tmhp:games/mortal_kombat/sub_zero_inj2_ice",
    "ice_glow": "tmhp:games/mortal_kombat/sub_zero_inj2_ice_glow",
    "hammer": "tmhp:games/mortal_kombat/sub_zero_hammer"
});

var capes = implement("fiskheroes:external/capes");
var utils = implement("fiskheroes:external/utils");

var ice;
var hammer;

function initEffects(renderer) {
    ice = renderer.createEffect("fiskheroes:overlay");
    ice.texture.set("ice", "ice_glow");

    hammer = renderer.createEffect("fiskheroes:model");
    hammer.setModel(utils.createModel(renderer, "tmhp:hammer", null, "hammer"));
    hammer.anchor.set("rightArm");
    hammer.mirror = false;

    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.99;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("cape");

    utils.bindParticles(renderer, "fiskheroes:killer_frost_ice").setCondition(entity => entity.getData("fiskheroes:cryo_charging"));
    utils.bindCloud(renderer, "fiskheroes:teleportation", "tmhp:ice_tp");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);
    addAnimationWithData(renderer, "strange.SWORD_POSE", "fiskheroes:sword_pose", "fiskheroes:blade_timer");
}
function render(entity, renderLayer, isFirstPersonArm) {
    if (!isFirstPersonArm && renderLayer == "CHESTPLATE") {
        cape.render(entity);
    }
    if (renderLayer == "CHESTPLATE") {
        hammer.opacity = entity.getInterpolatedData("fiskheroes:blade");
        hammer.render();
    }
    ice.opacity = entity.getData('fiskheroes:cryo_charge') || entity.is("DISPLAY");
    ice.render();
}