var speedster_base = implement("fiskheroes:external/speedster_base");
var landing = implement("sl:external/superhero_landing_alt");

function init(hero) {
  hero.setName("Cobalt Blue/\u00A7c\u00A7lAP 7\u00A7r");
  hero.setVersion("Earth-Prime");
  hero.setAliases("cb");
  hero.setTier(5);

  hero.setChestplate("item.superhero_armor.piece.chestplate");
  hero.setLeggings("item.superhero_armor.piece.pants");
  hero.setBoots("item.superhero_armor.piece.boots");
  hero.addEquipment("fiskheroes:flash_ring");

  hero.addPowers("sl:negativesfa");
  hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
  hero.addAttribute("WEAPON_DAMAGE", 0.0, 0);
  hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
  hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
  hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);

  hero.addKeyBind("REMOVEPUNCH", "key.reload", -1);
  hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
  hero.addKeyBind("SLOW_MOTION", "Flashtime", 2);
  hero.addKeyBind("CONSTRUCT", "Lightning Construct", 3);
  hero.addKeyBind("ENERGY_PROJECTION", "Lightning Beam", 4);
  hero.addKeyBind("DECOY", "Lightning Beam", 4);
  hero.addKeyBind("INTANGIBILITY", "Phase", 4);
  hero.addKeyBind("INVIS", "Invisibility", 4);
  hero.addKeyBind("CHARGED_BEAM", "Tornado Arms", 5);
  hero.addKeyBind("MIRAGE", "Speed Mirage", 5);
  hero.addKeyBind("TELEPORT", "Open Breach", 5);

  hero.setHasProperty(hasProperty);
  hero.setModifierEnabled(isModifierEnabled);
  hero.setKeyBindEnabled(isKeyBindEnabled);

  hero.addAttributeProfile("CONSTRUCT", constructProfile);
  hero.addAttributeProfile("INVIS", invisProfile);
  hero.addAttributeProfile("MIRAGE", mirageProfile);
  hero.setAttributeProfile(getProfile);

  var speedPunch = speedster_base.createSpeedPunch(hero);
  hero.setDamageProfile(function(entity) {
    return speedPunch.get(entity, null);
  });

  hero.addSoundEvent("PUNCH", [
    "sl:lightningpunch",
    "sl:saberslash"
  ]);
  hero.addSoundEvent("MASK_OPEN", [
    "fiskheroes:reverse_flash_vibration_on",
    "fiskheroes:reverse_flash_vibration_loop"
  ]);
  hero.addSoundOverrides(
    "NEGATIVE",
    speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_NEGATIVE)
  );

hero.setTickHandler(function(entity, manager) {
  var hash = entity.getEquipmentInSlot(3).nbt().getInteger("Upgrades");
  var slot0 = (hash >> (4 * 0)) & 0xF;
  var slot1 = (hash >> (4 * 1)) & 0xF;
  var slot2 = (hash >> (4 * 2)) & 0xF;
  var slot3 = (hash >> (4 * 3)) & 0xF;
  var slot4 = (hash >> (4 * 4)) & 0xF;
  landing.tick(entity, manager);
  speedster_base.tick(entity, manager);

  if (entity.as("PLAYER").isCreativeMode()) {
      manager.setData(entity, "fiskheroes:energy_charging", entity.getData("fiskheroes:speeding") && entity.isSprinting());
  } else {
      manager.setData(entity, "fiskheroes:energy_charging", entity.getData("fiskheroes:speeding") && entity.isSprinting() && (slot1 >= 2 && slot4 >= 2));
  }

  if (entity.getData("fiskheroes:beam_shooting") > 0) {
    manager.setDataWithNotify(entity, "fiskheroes:sonic_waves", true);
  } else {
    manager.setDataWithNotify(entity, "fiskheroes:sonic_waves", false);
  }
  
  if (entity.getData("fiskheroes:tentacles") == null && entity.getData("fiskheroes:tentacle_lift")) {
    manager.setData(entity, "fiskheroes:tentacle_lift", false);
  } else if (entity.getData("fiskheroes:tentacles") != null && !entity.getData("fiskheroes:tentacle_lift")) {
    manager.setData(entity, "fiskheroes:tentacle_lift", true);
  }
  
  if (entity.isSneaking()) {
    manager.setData(entity, "fiskheroes:slow_motion", false);
  }
  if (!entity.getData("fiskheroes:mask_open")) {
    manager.setData(entity, "sl:dyn/mirage", false);
  }
  if (entity.getData("sl:dyn/construct")) {
    manager.setData(entity, "fiskheroes:shield", true);
  }
if (!entity.getData("sl:dyn/construct") || entity.getData("fiskheroes:beam_charging")) {
    manager.setData(entity, "fiskheroes:shield", false);
}
  if (entity.getData("sl:dyn/invis") && entity.getData("sl:dyn/invis_timer") == 1) {
    manager.setData(entity, "fiskheroes:invisible", true);
  } else {
    manager.setData(entity, "fiskheroes:invisible", false);
  }
  if (entity.getData('fiskheroes:time_since_damaged') < 20) {
    manager.setData(entity, "sl:dyn/invis", false);
  }
  if (entity.getData('sl:dyn/mirage')) {
    manager.setData(entity, "sl:dyn/invis", false);
  }

});
}

function isModifierEnabled(entity, modifier) {
  var syaw = entity.getData("sl:dyn/startedyaw");
  var yaw = entity.rotYaw();
  var pitch = entity.rotPitch();
  var YDif = Math.round(entity.posY()) - entity.posY();
  var Jump = entity.getData("sl:dyn/jump");
  var hash = entity.getEquipmentInSlot(3).nbt().getInteger("Upgrades");
  var slot0 = (hash >> (4 * 0)) & 0xF;
  var slot1 = (hash >> (4 * 1)) & 0xF;
  var slot2 = (hash >> (4 * 2)) & 0xF;
  var slot3 = (hash >> (4 * 3)) & 0xF;
  var slot4 = (hash >> (4 * 4)) & 0xF;

  switch (modifier.name()) {
    case "fiskheroes:lightning_cast":
      if (!(entity.getData("fiskheroes:energy_charge") >= 0.1 && entity.getData("fiskheroes:energy_charge") < 1.0) || entity.getData("fiskheroes:intangible") || entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:energy_projection")) {
        return false;
      }
      break;
    case "fiskheroes:flight":
      return entity.getData("fiskheroes:intangible");
    case "fiskheroes:super_speed":
      return entity.getData("fiskheroes:dyn/superhero_landing_ticks") == 0;
case "fiskheroes:propelled_flight":
return (
    (entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:wheat')
    ||
    (entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:wheat')
    ||
    (entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:wheat')
    ||
    (entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:wheat')
) && !entity.isSneaking() && !entity.isOnGround() && !entity.isInWater() && entity.getData("fiskheroes:speeding") && !entity.getData("fiskheroes:intangible") && (slot3 >= 1 && slot2 >= 1 && slot3 >= 1 && slot4 >= 3 || entity.as("PLAYER").isCreativeMode());

    case "fiskheroes:energy_manipulation":
      switch (modifier.id()) {
        case "slow":
          return entity.getData('fiskheroes:speed') <= 5 || !entity.isSprinting();
        case "fast":
          return entity.getData('fiskheroes:speed') > 5 && entity.getData('fiskheroes:speed') <= 7 && entity.isSprinting();
        case "faster":
          return entity.getData('fiskheroes:speed') > 7 && entity.getData('fiskheroes:speed') <= 12 && entity.isSprinting();
        case "fastest":
          return entity.getData('fiskheroes:speed') > 12 && entity.getData('fiskheroes:speed') <= 30 && entity.isSprinting();
        case "godspeed":
          return entity.getData('fiskheroes:speed') > 30 && entity.isSprinting();
        default:
          break;
      }
      break;
    case "fiskheroes:tentacles":
      if (
        entity.world().getBlock(entity.pos().add(0, YDif, 0.5)) === 'minecraft:air'
        && entity.world().getBlock(entity.pos().add(0, YDif, -0.5)) === 'minecraft:air'
        && entity.world().getBlock(entity.pos().add(0.5, YDif, 0)) === 'minecraft:air'
        && entity.world().getBlock(entity.pos().add(-0.5, YDif, 0)) === 'minecraft:air'
        || (Jump === true
          && entity.world().getBlock(entity.pos().add(0, YDif + 0, 1.5)) === 'minecraft:air'
          && entity.world().getBlock(entity.pos().add(0, YDif + 0, -2.0)) === 'minecraft:air'
          && entity.world().getBlock(entity.pos().add(2.0, YDif + 0, 0)) === 'minecraft:air'
          && entity.world().getBlock(entity.pos().add(-2.0, YDif + 0, 0)) === 'minecraft:air')
        || entity.isInWater()
        || pitch > 30
        || yaw < syaw - 30
        || yaw > syaw + 30
        || !entity.getData("fiskheroes:speeding")
      ) {
        return false;
      }
      break;
    default:
      break;
  }

  return true;
}


function isKeyBindEnabled(entity, keyBind) {
  var hash = entity.getEquipmentInSlot(3).nbt().getInteger("Upgrades");
  var slot0 = (hash >> (4 * 0)) & 0xF;
  var slot1 = (hash >> (4 * 1)) & 0xF;
  var slot2 = (hash >> (4 * 2)) & 0xF;
  var slot3 = (hash >> (4 * 3)) & 0xF;
  var slot4 = (hash >> (4 * 4)) & 0xF;

  switch (keyBind) {
    case "SLOW_MOTION":
      return true;

    case "TENTACLES":
      if (entity.as("PLAYER").isCreativeMode()) {
        return true;
      } else {
        return slot3 >= 1 && slot2 >= 1 && slot3 >= 1 && slot4 >= 3;
      }

    case "DECOY":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.getData("fiskheroes:mask_open") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("sl:dyn/construct");
      } else {
        return !entity.getData("fiskheroes:mask_open") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("sl:dyn/construct") && (slot1 >= 3 && slot4 >= 3);
      }

    case "ENERGY_PROJECTION":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.getData("fiskheroes:mask_open") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("sl:dyn/construct") && entity.getData('fiskheroes:time_since_damaged') > 20;
      } else {
        return !entity.getData("fiskheroes:mask_open") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("sl:dyn/construct") && entity.getData('fiskheroes:time_since_damaged') > 20 && (slot1 >= 3 && slot4 >= 3);
      }

    case "TELEPORT":
      if (entity.as("PLAYER").isCreativeMode()) {
        return entity.getData("fiskheroes:energy_charge") > 0.5;
      } else {
        return entity.getData("fiskheroes:energy_charge") > 0.5 && (slot1 >= 1 && slot4 >= 5);
      }

    case "CONSTRUCT":
      if (entity.as("PLAYER").isCreativeMode()) {
        return true;
      } else {
        return slot1 >= 2 && slot4 >= 3;
      }

    case "MIRAGE":
      if (entity.as("PLAYER").isCreativeMode()) {
        return entity.getData("fiskheroes:energy_charge") < 0.5 && entity.getData("fiskheroes:mask_open");
      } else {
        return entity.getData("fiskheroes:energy_charge") < 0.5 && entity.getData("fiskheroes:mask_open") && (slot0 >= 1 && slot4 >= 2);
      }

    case "CHARGED_BEAM":
      if (entity.as("PLAYER").isCreativeMode()) {
        return entity.getData("fiskheroes:energy_charge") < 0.5 && !entity.getData("fiskheroes:mask_open");
      } else {
        return entity.getData("fiskheroes:energy_charge") < 0.5 && !entity.getData("fiskheroes:mask_open") && (slot1 >= 1 && slot4 >= 1);
      }

    case "INVIS":
      if (entity.as("PLAYER").isCreativeMode()) {
        return entity.isSneaking() && entity.getData("fiskheroes:mask_open");
      } else {
        return entity.isSneaking() && entity.getData("fiskheroes:mask_open") && (slot4 >= 4);
      }

    case "INTANGIBILITY":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.isSneaking() && entity.getData("fiskheroes:mask_open");
      } else {
        return !entity.isSneaking() && entity.getData("fiskheroes:mask_open") && (slot0 >= 1 && slot4 >= 2 && slot2 >= 1);
      }

     case "REMOVEPUNCH":
         return entity.getData("fiskheroes:energy_projection") || entity.getData("fiskheroes:beam_charging");

    default:
      return true;
  }
}

function getProfile(entity) {
  if (entity.getData("sl:dyn/construct")) {
    return "CONSTRUCT";
  }
  if (entity.getData("sl:dyn/invis")) {
    return "INVIS";
  }
  if (entity.getData("sl:dyn/mirage")) {
    return "MIRAGE";
  }
  return null;
}

function constructProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
  profile.addAttribute("KNOCKBACK", 1.0, 0);
}
function invisProfile(profile) {
  profile.inheritDefaults();
}
function mirageProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("REACH_DISTANCE", 1.5, 0);
}
function hasProperty(entity, property) {
  var hash = entity.getEquipmentInSlot(3).nbt().getInteger("Upgrades");
  var slot0 = (hash >> (4 * 0)) & 0xF;
  var slot1 = (hash >> (4 * 1)) & 0xF;
  var slot2 = (hash >> (4 * 2)) & 0xF;
  var slot3 = (hash >> (4 * 3)) & 0xF;
  var slot4 = (hash >> (4 * 4)) & 0xF;
  
  switch (property) {
    case "MASK_TOGGLE":
      if (entity.as("PLAYER").isCreativeMode()) {
        return true;
      } else {
        return (slot4 >= 1);
      }
    case "BREATHE_SPACE":
      return false;
    default:
      return false;
  }
}
