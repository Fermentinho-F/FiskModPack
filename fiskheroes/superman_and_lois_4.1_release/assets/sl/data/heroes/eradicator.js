var landing = implement("sl:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var utils = implement("fiskheroes:external/utils");
var boostutils = implement("sl:external/boost_utils");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");
var kutils = implement("sl:external/kryptonian_utils");

function init(hero) {
  hero.setName("The Eradicator/\u00A7c\u00A7lAP 8\u00A7r");
  hero.setTier(9);
  hero.hide();

  hero.setDefaultScale(1.08);

  hero.setChestplate("item.superhero_armor.piece.chestpiece");
  hero.setLeggings("item.superhero_armor.piece.pants");
  hero.setBoots("item.superhero_armor.piece.boots");

  hero.addPowers("sl:kryptonian_physiology", "sl:eradicator_device");
  hero.addAttribute("PUNCH_DAMAGE", 13.0, 0);
  hero.addAttribute("WEAPON_DAMAGE", -2.2, 0);
  hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
  hero.addAttribute("SPRINT_SPEED", 0.55, 1);
  hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);
  hero.addAttribute("KNOCKBACK", 2.0, 0);
  hero.addAttribute("MAX_HEALTH", 2.0, 0);
  hero.addAttribute("IMPACT_DAMAGE", 0.9, 1);

  hero.addKeyBind("REMOVEPUNCH", "removepunch", -1);
  hero.addKeyBind("AIM", "key.heatVision", 1);
  hero.addKeyBind("HEAT_VISION", "key.heatVision", 1);
  hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
  hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
  hero.addKeyBind("ENERGY_PROJECTION", "Cold Breath", 4);
  hero.addKeyBind("SHIELD", "Forceshield", 5);
  hero.addKeyBind("CHARGED_BEAM", "\u00A7c\u00A7mUnavailable", 5);
  hero.addKeyBind("ERADICATOR", "Supercharge", 5);
  hero.addKeyBind("boost", "Boost", 2);
  hero.addKeyBind("boost2", "Boost", 2);
  hero.addKeyBind("GROUND_SMASH", "\u00A76\u00A7lEarth Smash - 100 Percent", 1);
  hero.addKeyBind("0", "\u00A76\u00A7lEarth Smash - 0 Percent", 1);
  hero.addKeyBind("25", "\u00A76\u00A7lEarth Smash - 25 Percent", 1);
  hero.addKeyBind("50", "\u00A76\u00A7lEarth Smash - 50 Percent", 1);
  hero.addKeyBind("75", "\u00A76\u00A7lEarth Smash - 75 Percent", 1);
  hero.addKeyBind("100", "\u00A76\u00A7lEarth Smash - 100 Percent", 1);
  hero.addKeyBind("suitup", "Suit Up", 5);

  // Name keys

  hero.addKeyBind("VTHUNDERCLAP", "Thunderclap", 5);
  hero.addKeyBind("THESOLARFLARE", "\u00A74\u00A7lSolar Flare", 5);
  
  // Sounds

  hero.addSoundEvent("PUNCH", "sl:toughpunch");
  hero.addSoundEvent("AIM_START", "sl:hvcharge");
  hero.addSoundEvent("MASK_OPEN", ["sl:heat_vision_idle", "sl:hvcharge_conditionless"]);
  hero.addSoundEvent("MASK_CLOSE", "sl:hv_end_mask");

  hero.setKeyBindEnabled(isKeyBindEnabled);
  hero.setModifierEnabled(isModifierEnabled);
  hero.setTierOverride(getTierOverride);
  hero.supplyFunction("canAim", canAim);
  hero.supplyFunction("canDischargeEnergy", false);
  hero.setHasProperty(hasProperty);

  hero.addAttributeProfile("LANDPROFILE", landProfile);
  hero.addAttributeProfile("ERADICATOR", eradicatorProfile);
  hero.addAttributeProfile("sun", sunProfile);
  hero.addAttributeProfile("suitup", suitupProfile);
  hero.addAttributeProfile("clap", clapProfile);
  hero.addAttributeProfile("boost", boostProfile);
  hero.addAttributeProfile("boost2", boost2Profile);
  hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("ERADICATOR", {
        "types": {
            "SUPERCHARGED": 1.0,
            "BLUNT": 0.2
        }
    });

hero.setTickHandler((entity, manager) => {
  landing.tick(entity, manager);
  soft_landing.tick(entity, manager);
  moonFly.moonFly(entity, manager);
  speedsprint.tick(entity, manager);
  kutils.oxygenStrong(entity, manager);

  var ls = entity.getData("sl:dyn/lightonoff");
  var l = entity.getData("sl:dyn/light");
  if (l >=1) {
    manager.setInterpolatedData(entity, "sl:dyn/lightonoff", true)
  };
  if (l <=0) {
      manager.setInterpolatedData(entity, "sl:dyn/lightonoff", false)
  };
  manager.incrementData(entity, "sl:dyn/light", 90, !ls);
 

  var x = entity.posX();
  var y = entity.posY();
  var z = entity.posZ();
  var dim = entity.world().getDimension();
  var es_charge = entity.getData("sl:dyn/es_charge")
  var oxygen = entity.getData("sl:dyn/oxygen");

  // Dome Stuff

  var domeId = entity.getData("fiskheroes:lightsout_id");
  var dome = entity.world().getEntityById(domeId);

if (dome.exists()) {
    var contained = dome.as("SHADOWDOME").getContainedEntities();

    for (var i = 0; i < contained.size(); ++i) {
        var inside = contained.get(i);
        if (inside.getUUID() === entity.getUUID()) {
            for (var i = 0; i < contained.size(); ++i) {
                var inside = contained.get(i);
                if (inside.getUUID() !== entity.getUUID() && entity.getData("sl:dyn/playsound") && inside.isPlayer()) {
                    entity.playSound("sl:main.superhearingsound", 1, 1.0);
                    manager.setData(entity, "sl:dyn/playsound", false);
                }
            }
            return true;
        }
    }
}

    if (!entity.getData("fiskheroes:lightsout") && !entity.getData("sl:dyn/wasdomeused")) {
        manager.setData(entity, "fiskheroes:lightsout", true);
        manager.setData(entity, "sl:dyn/wasdomeused", true);
        manager.setData(entity, "sl:dyn/dometimer", 0);
        manager.setData(entity, "sl:dyn/playsound", true);
    }


  // Dome stuff

    if (!entity.getData("sl:dyn/eradicator")) {
      manager.setData(entity, "sl:dyn/es_charge", 0);
    }

    if (entity.getData("sl:dyn/sboost2")) {
      manager.setData(entity, "sl:dyn/es_charge", es_charge + 0.00125);
    }

    if (entity.getData("fiskheroes:energy_projection")) {
      manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.004);
    }

    if ((dim === 0 || dim === -1 || dim === 2 || dim === 7 || dim === 20) && !entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/oxygen") > 0 && entity.world().getBlock(entity.pos().add(0.0, 1.5, 0.0)) != "minecraft:water") {
      manager.setData(entity, "sl:dyn/oxygen", oxygen - 0.005);
    }

    if ((dim === 2595 || dim === 2594) && !entity.getData("fiskheroes:energy_projection")) {
      manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0005);
    } else if ((dim === 2595 || dim === 2594) && entity.getData("fiskheroes:energy_projection")) {
      manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.0045);
    }

  if (entity.getData("fiskheroes:beam_shooting")) {
    manager.setData(entity, "sl:dyn/clap_animation_cooldown", true);
  }

  if (entity.getData("fiskheroes:beam_charge") === 0) {
    manager.setData(entity, "sl:dyn/clap_animation_cooldown", false);
  }

  boostutils.flightSL(entity, manager);

  if (entity.getData("sl:dyn/eradicator")) {
    manager.setData(entity, "fiskheroes:energy_charge", 0);
  }

  if (!entity.getData("sl:dyn/eradicator")) {
    manager.setData(entity, "sl:dyn/sboost2", false);
  }

  manager.setData(
    entity,
    "fiskheroes:energy_charging",
    entity.posY() > 1028 &&
      (dim === 0 || dim === 2595) &&
      !entity.isSprinting() &&
      !entity.getData("sl:dyn/eradicator") &&
      !entity.getData("sl:dyn/suitup") &&
      entity.getData("sl:dyn/eradicator_cooldown") == 0 &&
      entity.getData("fiskheroes:prev_flight_timer") > 0.9
  );

  if (
    entity.getData("fiskheroes:energy_charging") &&
    entity.posY() > 1028 &&
    (dim === 0 || dim === 2595) &&
    !entity.isSprinting() &&
    entity.getData("sl:dyn/eradicator_cooldown") == 0 &&
    !entity.getData("sl:dyn/eradicator") &&
    !entity.getData("sl:dyn/suitup") &&
    entity.getData("fiskheroes:prev_flight_timer") > 0.9
  ) {
    manager.setData(entity, "sl:dyn/sun", true);
  } else {
    manager.setData(entity, "sl:dyn/sun", false);
  }

  if (
    entity.getData("fiskheroes:beam_shooting") &&
    !entity.getData("sl:dyn/eradicator")
  ) {
    manager.setData(entity, "sl:dyn/clap", true);
  } else {
    manager.setData(entity, "sl:dyn/clap", false);
  }

  if (
    entity.getData("fiskheroes:beam_charge") === 0 &&
    entity.getData("fiskheroes:time_since_damaged") > 10.0 &&
    !entity.getData("sl:dyn/hvfloat")
  ) {
    manager.setData(entity, "sl:dyn/hvint", Math.floor(Math.random() < 0.2));
    manager.setData(entity, "sl:dyn/hvfloat", true);
  }

  if (
    entity.getData("fiskheroes:beam_charge") !== 0 ||
    entity.getData("fiskheroes:time_since_damaged") <= 10.0
  ) {
    manager.setData(entity, "sl:dyn/hvfloat", false);
  }

  if (entity.isOnGround() && !entity.isSneaking() && !entity.getData("sl:dyn/eradicator")) {
    manager.setData(entity, "sl:dyn/abilities_cycle", 1);
  } else if (entity.getData("sl:dyn/eradicator")) {
    manager.setData(entity, "sl:dyn/abilities_cycle", 2);
  } else {
    manager.setData(entity, "sl:dyn/abilities_cycle", 1);
  }
});
}

function isModifierEnabled(entity, modifier) {
  switch (modifier.name()) {
    case "fiskheroes:speed_disintegration":
      return false;
    case "fiskheroes:super_speed":
      return !entity.getData("fiskheroes:flying");
    case "fiskheroes:heat_vision":
      switch (modifier.id()) {
        case "heatvision":
          return !entity.getData("sl:dyn/eradicator");
        case "solarflare":
          return entity.getData("sl:dyn/eradicator");
        default:
          break;
      }
      break;
    case "fiskheroes:energy_projection":
      switch (modifier.id()) {
        case "normalbreath":
          if (entity.getData("sl:dyn/oxygen") > 0.8) {
            return !entity.getData("sl:dyn/eradicator") && !entity.getData("sl:dyn/sboost") && entity.getData("sl:dyn/oxygen") < 1 && entity.getData("fiskheroes:energy_projection");
          } else {
            return !entity.getData("sl:dyn/eradicator") && !entity.getData("sl:dyn/sboost") && entity.getData("sl:dyn/oxygen") < 1;
          }
        case "eradicator_beam":
          if (entity.getData("sl:dyn/oxygen") > 0.8) {
            return entity.getData("sl:dyn/eradicator_timer") == 1 && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/oxygen") < 1 && entity.getData("fiskheroes:energy_projection");
          } else {
            return entity.getData("sl:dyn/eradicator_timer") == 1 && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/oxygen") < 1;
          }
        default:
          break;
      }
      break;
    case "fiskheroes:controlled_flight":
      switch (modifier.id()) {
        case "normal":
          return (
            !entity.getData("sl:dyn/eradicator") && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/sboost2")
          );
        case "normalboosted":
          return entity.getData("sl:dyn/sboost");
        case "superchargedboosted":
          return entity.getData("sl:dyn/sboost2");
        case "supercharged":
          return entity.getData("sl:dyn/eradicator") && !entity.getData("sl:dyn/sboost2");
        default:
          break;
      }
      break;
    case "fiskheroes:charged_beam":
      switch (modifier.id()) {
        case "thunderclap":
          return !entity.getData("sl:dyn/eradicator") && entity.getData("sl:dyn/abilities_cycle") == 1;
        case "solarblast":
          return entity.getData("sl:dyn/eradicator") && entity.getData("sl:dyn/abilities_cycle") == 2;
        default:
          break;
      }
      break;
    default:
      break;
  }
  return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var es_charge = entity.getData("sl:dyn/es_charge")
    switch (keyBind) {
        case "HEAT_VISION":
            if (!entity.getData("fiskheroes:mask_open")) {
                return entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aimed_timer") >= 1 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/sboost2");
            } else {
                return entity.getData("fiskheroes:mask_open_timer2") == 1 && !entity.getData("fiskheroes:beam_shooting");
            }
    case "AIM":
        if (entity.getData("sl:dyn/eradicator") && !entity.getData("fiskheroes:mask_open") || entity.getData("fiskheroes:mask_open") || entity.getData("fiskheroes:energy_projection") || entity.getData("sl:dyn/sboost")) {
            return false;
        } else {
            return true;
        }

        case "SHIELD":
            return entity.getData("sl:dyn/eradicator");

        case "0":
            return es_charge < 0.25 && entity.getData("sl:dyn/eradicator") && !entity.getData("fiskheroes:mask_open");

        case "25":
            return es_charge > 0.25 && es_charge < 0.5 && !entity.getData("fiskheroes:mask_open");

        case "50":
            return es_charge > 0.5 && es_charge < 0.75 && !entity.getData("fiskheroes:mask_open");

        case "75":
            return es_charge > 0.75 && es_charge < 1 && !entity.getData("fiskheroes:mask_open");

        case "100":
            return es_charge > 1 && !entity.getData("fiskheroes:mask_open");

        case "SUPER_SPEED":
            return !entity.getData("fiskheroes:flight_boost_timer") > 0;

        case "REMOVEPUNCH":
            return entity.getData("fiskheroes:beam_charging");

        case "ENERGY_PROJECTION":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost");

        case "ERADICATOR":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.getData("sl:dyn/eradicator") && !entity.isSneaking() && entity.getData("flight_boost_timer") > 0 && entity.getData("sl:dyn/eradicator_cooldown") == 0 || entity.getData("fiskheroes:energy_charge") === 1.0;
      } else {
        return entity.getData("fiskheroes:energy_charge") === 1.0;
      }

        case "func_CHANGESUIT":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.getData("sl:dyn/eradicator") && !entity.isSneaking() && entity.getData("flight_boost_timer") > 0 && entity.getData("sl:dyn/eradicator_cooldown") == 0 || entity.getData("fiskheroes:energy_charge") === 1.0;
      } else {
        return entity.getData("fiskheroes:energy_charge") === 1.0;
      }

        case "suitup":
            return !entity.getData("sl:dyn/eradicator") && entity.isSneaking() && entity.getData("fiskheroes:energy_charge") == 0;

        case "GROUND_SMASH":
            return entity.getData("sl:dyn/eradicator") && !entity.getData("fiskheroes:mask_open") && es_charge > 1;

        case "CHARGED_BEAM":
            if (!entity.getData("sl:dyn/eradicator")) {
                return entity.getData("flight_boost_timer") === 0 && !entity.isSneaking() && entity.getData("fiskheroes:energy_charge") == 0;
            } else {
                return !entity.getData("sl:dyn/sboost2");
            }

        case "VTHUNDERCLAP":
                return entity.getData("flight_boost_timer") === 0 && !entity.isSneaking() && !entity.getData("sl:dyn/eradicator") && entity.getData("sl:dyn/abilities_cycle") == 1 && entity.getData("fiskheroes:energy_charge") == 0;

        case "THESOLARFLARE":
                return entity.getData("sl:dyn/eradicator") && entity.getData("sl:dyn/abilities_cycle") == 2;

        case "boost":
            return entity.getData("fiskheroes:flight_boost_timer") > 0 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/eradicator");

        case "boost2":
            return entity.getData("fiskheroes:flight_boost_timer") > 0 && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/eradicator");

        default:
            return true;
    }
}

function getProfile(entity) {
  if (entity.getData("sl:dyn/eradicator")) {
    return "eradicator";
  } else if (entity.getData("sl:dyn/sboost")) {
    return "boost";
  } else if (entity.getData("sl:dyn/sboost2")) {
    return "boost2";
  } else if (entity.getData("sl:dyn/sun")) {
    return "sun";
  } else if (entity.getData("sl:dyn/clap")) {
    return "clap";
  } else if (entity.getData("sl:dyn/suitup")) {
    return "suitup";
  } else if (entity.getData("sl:dyn/soft_landing_timer") > 0) {
    return "LANDPROFILE";
  }
  return null;
}

function landProfile(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -100.0, 0);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 2);
}

function eradicatorProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 15.5, 0);
  profile.addAttribute("KNOCKBACK", 3.0, 0);
  profile.addAttribute("BASE_SPEED_LEVELS", 4.8, 0);
  profile.addAttribute("IMPACT_DAMAGE", 2.0, 1);
}

function boostProfile(profile) {
  profile.inheritDefaults();
}

function boost2Profile(profile) {
  profile.inheritDefaults();
}
function sunProfile(profile) {
  profile.inheritDefaults();
}
function clapProfile(profile) {
  profile.inheritDefaults();
}
function suitupProfile(profile) {
  profile.inheritDefaults();
}
function canAim(entity) {
    if (entity.getData("fiskheroes:beam_charge") === 0) {
        if (entity.getData('fiskheroes:time_since_damaged') > 10.0) {
            return true;
        } else {
            if (entity.getData("sl:dyn/hvint") === 0) {
                return true;
            }
        }
    }
    return false;
}

function getTierOverride(entity) {
  if (entity.getData("sl:dyn/eradicator")) {
    return 10;
  }
  
  if (entity.getData("sl:dyn/suitup")) {
    return 8;
  }
  
  return 9;
}
function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return entity.getData('fiskheroes:time_since_damaged') > 10.0;
        case "BREATHE_SPACE":
            return true;
        default:
            return false;
    }
}