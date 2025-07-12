extend("fiskheroes:hero_basic");

loadTextures({
  "layer1": "sl:the_flash_dceu_layer1",
  "layer2": "sl:the_flash_dceu_layer2",
  "lights": "sl:the_flash_dceu_lights",
  "lights1": "sl:the_flash_dceu_lights_layer1",
  "lights2": "sl:the_flash_dceu_lights_layer2",
  "mask": "sl:the_flash_dceu_helmet.tx.json",
  "mask_lights2": "sl:the_flash_dceu_lights_helmet",
  "mask_lights": "sl:temp_lights.tx.json",
  "hunger_1": "sl:the_flash_dceu_hunger_indicator_1",
  "hunger_2": "sl:the_flash_dceu_hunger_indicator_2",
  "hunger_3": "sl:the_flash_dceu_hunger_indicator_3",
  "ring_texture": "sl:dceu_flash_ring_texture",
  "null": "sl:null"
});

var speedster = implement("sl:external/dceu_speedster_utils");
var utils = implement("sl:external/utils");
var iron_man_helmet = implement("fiskheroes:external/iron_man_helmet");

var helmet;
var vibration;
var overlay;
var hunger_1;
var hunger_2;
var hunger_3;
var ring;

function init(renderer) {
  parent.init(renderer);
renderer.setTexture((entity, renderLayer) => {
    if (entity.as("DISPLAY").getDisplayType() === "MINI_SUIT_ITEM") {
        return "null";
    } else if (renderLayer == "HELMET" && entity.getInterpolatedData("fiskheroes:mask_open_timer2") > 0) {
        return "layer2";
    }
    return renderLayer == "LEGGINGS" ? "layer2" : "layer1";
});
    renderer.setLights((entity, renderLayer) => {
        if (entity.as("DISPLAY").getDisplayType() === "MINI_SUIT_ITEM") {
            return null;
        }
        return entity.getInterpolatedData("sl:dyn/speed_timer") === 1 && entity.getData("fiskheroes:intangible") ? "lights" : null;
    });

    renderer.setItemIcon("HELMET", "the_flash_dceu_0_active");
    renderer.setItemIcon("CHESTPLATE", "the_flash_dceu_1_active");
    renderer.setItemIcon("LEGGINGS", "the_flash_dceu_2_active");
    renderer.setItemIcon("BOOTS", "the_flash_dceu_3_active");
}


function initEffects(renderer) {

    ring = renderer.createEffect("fiskheroes:model");
    ring.setModel(utils.createModel(renderer, "sl:ModelFlashRing", "ring_texture"));
    ring.anchor.set("body");
    ring.mirror = false;

  var forcefield = renderer.bindProperty("fiskheroes:forcefield");
  forcefield.color.set(0xFF7F2B);
  forcefield.setShape(36, 18).setOffset(0.0, 6.0, 0.0).setScale(1.25);
  forcefield.setCondition(entity => {
      entity.getData("fiskheroes:speeding");
      forcefield.opacity = entity.getInterpolatedData("sl:dyn/speedup_timer") * 0.15;
      return true;
  });
  hunger_3 = renderer.createEffect("fiskheroes:overlay");
  hunger_3.texture.set(null, "hunger_3");
  hunger_2 = renderer.createEffect("fiskheroes:overlay");
  hunger_2.texture.set(null, "hunger_2");
  hunger_1 = renderer.createEffect("fiskheroes:overlay");
  hunger_1.texture.set(null, "hunger_1");
  helmet = iron_man_helmet.createFolding(renderer, "mask", "mask_lights", "fiskheroes:mask_open_timer2");
  overlay = renderer.createEffect("fiskheroes:overlay");
  overlay.texture.set(null, "lights1");
  overlay2 = renderer.createEffect("fiskheroes:overlay");
  overlay2.texture.set(null, "lights2");
  overlay_mask = renderer.createEffect("fiskheroes:overlay");
  overlay_mask.texture.set(null, "mask_lights2");
  vibration = renderer.createEffect("fiskheroes:vibration");
  vibration.includeEffects(helmet.effect);
  speedster.init(renderer, "sl:dceu_flash");
  utils.bindTrail(renderer, "sl:dceu_flash_static").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.isSprinting() && entity.getData("fiskheroes:speed") < 4);

  utils.bindTrail(renderer, "sl:dceu_flash_static_fast").setCondition(entity => entity.getData("fiskheroes:speeding") && !entity.isSprinting() && entity.getData("fiskheroes:speed") >= 4);
  
  utils.bindParticles(renderer, "sl:running_smoke").setCondition(entity => entity.getInterpolatedData('fiskheroes:speed_sprinting') && entity.getData("fiskheroes:speed") > 1 && entity.isOnGround());
}

function initAnimations(renderer) {
  parent.initAnimations(renderer);

addAnimationWithData(renderer, "cobalt.JETPACK", "sl:wall_run", "fiskheroes:jetpacking_timer").setCondition(entity => {
    return !entity.getData("fiskheroes:intangible");
});
  addAnimationWithData(renderer, "flash.POSE", "sl:flash_pose", "fiskheroes:aimed_timer").priority = -10;
  addAnimationWithData(renderer, "flash.BRAKE", "sl:flash_brake", "sl:dyn/brake_timer").priority = 10;

 addAnimation(renderer, "flash.WALL_RUNNING", "sl:wall_running")
    .setData((entity, data) => {
data.load(0, entity.getData("fiskheroes:jetpacking_timer") == 1 
    ? Math.sin(entity.loop(2.5 * Math.PI) * Math.PI * 2) 
    : 0
);

data.load(1, entity.getData("fiskheroes:jetpacking_timer") == 1 
    ? Math.sin(entity.loop(2.5 * Math.PI) * Math.PI * 2) 
    : 0
);

    });

  renderer.removeCustomAnimation("basic.AIMING");

}

function render(entity, renderLayer, isFirstPersonArm) {
  parent.render(entity, renderLayer, isFirstPersonArm);
  
  if (
    (renderLayer === "CHESTPLATE" ||
    renderLayer === "HELMET" ||
    renderLayer === "BOOTS") &&
    !entity.getData("fiskheroes:intangible")
  ) {
    overlay.opacity = entity.getInterpolatedData("sl:dyn/speed_timer");
    overlay.render();
  }

  if (renderLayer === "LEGGINGS" && !entity.getData("fiskheroes:intangible")) {
    overlay2.opacity = entity.getInterpolatedData("sl:dyn/speed_timer");
    overlay2.render();
  }

  if (renderLayer === "HELMET" && entity.getData("fiskheroes:mask_open_timer") < 0.5) {
    overlay_mask.opacity = entity.getInterpolatedData("sl:dyn/speed_timer");
    overlay_mask.render();
  }

  if (!entity.isDisplayStand() && entity.getData("fiskheroes:intangible")) {
    vibration.render();
  }

  if (!isFirstPersonArm && renderLayer === "HELMET") {
    helmet.render(entity);
  }

  if (entity.as("DISPLAY").getDisplayType() === "MINI_SUIT_ITEM") {
    ring.setScale(2);
    ring.setRotation(0, 90, 0);
    ring.render();
  }

if (entity.isPlayer() && renderLayer === "CHESTPLATE" && entity.as("DISPLAY").getDisplayType() !== "MINI_SUIT_ITEM") {
    if (entity.as("PLAYER").getFoodLevel() > 13) {
        hunger_3.render();
    } else if (entity.as("PLAYER").getFoodLevel() <= 13 && entity.as("PLAYER").getFoodLevel() > 7) {
        hunger_2.render();
    } else if (entity.as("PLAYER").getFoodLevel() <= 7) {
        hunger_1.render();
    }
}

}
