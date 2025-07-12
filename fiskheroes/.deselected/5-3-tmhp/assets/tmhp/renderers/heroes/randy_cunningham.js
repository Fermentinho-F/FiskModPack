extend("fiskheroes:hero_basic");
loadTextures({
    "suit": "tmhp:randy_cunningham/suit.tx.json",
    "base": "tmhp:randy_cunningham/suit",
    "mask_open": "tmhp:randy_cunningham/mask_open",
    "scarf": "tmhp:randy_cunningham/scarf",
    "flame": "tmhp:randy_cunningham/flame",
    "flame_scarf": "tmhp:randy_cunningham/flame_scarf",
      "sword": "tmhp:randy_cunningham/weapons/sword",
      "flame_sword": "tmhp:randy_cunningham/weapons/flame_sword",
      "sickle": "tmhp:randy_cunningham/weapons/sickle",
         "sickle_on": "tmhp:randy_cunningham/weapons/sickle_on",
         "chain": "tmhp:randy_cunningham/weapons/chain"
});

var utils = implement("fiskheroes:external/utils");
var capes = implement("fiskheroes:external/capes");
var flame_cape;
var sword;
var flame_sword;
var sickle;

function init(renderer) {
    parent.init(renderer);
    renderer.setTexture((entity, renderLayer) => {
        if (!entity.is("DISPLAY")) {
            var timer = entity.getInterpolatedData("tmhp:dyn/ninja_timer");
            return timer == 0 ? "mask_open" : timer < 1 ? "suit" : "base";
        }
        return "base";
    });
    renderer.setLights((entity, renderLayer) => {
        return entity.getInterpolatedData("tmhp:dyn/flame_mod_timer") < 1 ? null : "flame";
    });

    renderer.showModel("HELMET", "head", "headwear", "body", "rightArm", "leftArm", "rightLeg", "leftLeg");
}

function initAnimations(renderer) {
    parent.initAnimations(renderer);

    addAnimationWithData(renderer, "ninja_sword.SWORD_POSE", "tmhp:sword_pose", "fiskheroes:shield_timer");
    addAnimation(renderer, "scout.ROLL", "fiskheroes:falcon_dive_roll")
        .setData((entity, data) => {
            var f = entity.getInterpolatedData("fisktag:dyn/leap_cooldown");
            data.load(f > 0 ? Math.min((1 - f) * 2.5, 1) : 0);
        });
}
function initEffects(renderer) {
    var physics = renderer.createResource("CAPE_PHYSICS", null);
    physics.weight = 0.9;
    physics.maxFlare = 0.99;
    cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    cape.effect.texture.set("scarf");
    flame_cape = capes.createDefault(renderer, 24, "fiskheroes:cape_default.mesh.json", physics);
    flame_cape.effect.texture.set("flame_scarf");

    sword = renderer.createEffect("fiskheroes:model");
    sword.setModel(utils.createModel(renderer, "tmhp:randy_sword", "sword", null));
    sword.anchor.set("rightArm");
    sword.mirror = false;
    flame_sword = renderer.createEffect("fiskheroes:model");
    flame_sword.setModel(utils.createModel(renderer, "tmhp:randy_sword", null, "flame_sword"));
    flame_sword.anchor.set("rightArm");
    flame_sword.mirror = false;
    utils.bindParticles(renderer, "tmhp:hellfire_katana").setCondition(entity => entity.getInterpolatedData("fiskheroes:shield") && entity.getInterpolatedData("tmhp:dyn/flame_mod"));

    sickle = renderer.createEffect("fiskheroes:model");
    sickle.setModel(utils.createModel(renderer, "tmhp:randy_sickle", "sickle", null));
    sickle.anchor.set("rightArm");
    sickle.mirror = false;

    utils.bindCloud(renderer, "fiskheroes:teleportation", "tmhp:ninja");

    var webs = renderer.bindProperty("fiskheroes:webs");
    webs.textureRope.set("chain");
    webs.textureRopeBase.set("sickle_on");
    webs.textureLarge.set("sickle_on");
}
function render(entity, renderLayer, isFirstPersonArm) {
  sword.opacity = entity.getInterpolatedData("fiskheroes:shield");
  sword.render();
  flame_sword.opacity = entity.getInterpolatedData("fiskheroes:shield") && entity.getInterpolatedData("tmhp:dyn/flame_mod_timer");
  flame_sword.render();
  sickle.opacity = entity.getInterpolatedData("fiskheroes:blade");
  sickle.render();
    if (entity.is("DISPLAY") || !isFirstPersonArm && renderLayer == "HELMET" && entity.getInterpolatedData("tmhp:dyn/ninja_timer") && !entity.getInterpolatedData("tmhp:dyn/flame_mod_timer")) {
        cape.render(entity);
    }
    if (!isFirstPersonArm && renderLayer == "HELMET" && entity.getInterpolatedData("tmhp:dyn/flame_mod_timer")) {
        flame_cape.render(entity);
    }
}