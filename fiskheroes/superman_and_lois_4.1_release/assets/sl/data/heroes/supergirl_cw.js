var landing = implement("sl:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var utils = implement("fiskheroes:external/utils");
var boostutils = implement("sl:external/boost_utils");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");
var kutils = implement("sl:external/kryptonian_utils");
var viputils = implement("sl:external/vip");

function init(hero) {
  hero.setName("Supergirl/\u00A7c\u00A7lAP 7\u00A7r");
  hero.setVersion("Earth-Prime");
  hero.setTier(9);

  hero.setDefaultScale(0.99);

  hero.setHelmet("item.superhero_armor.piece.hair");
  hero.setChestplate("item.superhero_armor.piece.chestpiece");
  hero.setLeggings("Skirt");
  hero.setBoots("item.superhero_armor.piece.boots");

  hero.addPowers("sl:kryptonian_physiology_cw");
  hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
  hero.addAttribute("WEAPON_DAMAGE", -2.4, 0);
  hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
  hero.addAttribute("SPRINT_SPEED", 0.4, 1);
  hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);
  hero.addAttribute("KNOCKBACK", 2.0, 0);
  hero.addAttribute("MAX_HEALTH", 2.0, 0);
  hero.addAttribute("IMPACT_DAMAGE", 0.9, 1);

  hero.addKeyBind("REMOVEPUNCH", "key.reload", -1);
  hero.addKeyBind("HV_CHARGE", "key.heatVision", 1);
  hero.addKeyBind("heat_vision_unavailable", "\u00A7mHeat Vision", 1);
  hero.addKeyBind("HEAT_VISION", "key.heatVision", 1);
  hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
  hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
  hero.addKeyBind("energy_proj_unavailable", "\u00A7mCold Breath", 4);
  hero.addKeyBind("ENERGY_PROJECTION", "Cold Breath", 4);
  hero.addKeyBind("GRAVITY_MANIPULATION", "Cold Breath", 4);
  hero.addKeyBind("CHARGED_BEAM", "Thunderclap", 5);
  hero.addKeyBind("boost", "Boost", 2);
  hero.addKeyBind("boost2", "Boost", 2);
  hero.addKeyBind("XKRYPTONITE", "Consume X-Kryptonite Vial", 5);

  hero.addSoundEvent("PUNCH", "sl:toughpunch");
  hero.addSoundEvent("AIM_START", "sl:hvcharge_cw");
  hero.addSoundEvent("MASK_OPEN", ["sl:heat_vision_idle", "sl:hvcharge_cw_conditionless"]);
  hero.addSoundEvent("MASK_CLOSE", "sl:cw_hv_end_mask");

  hero.setKeyBindEnabled(isKeyBindEnabled);
  hero.setModifierEnabled(isModifierEnabled);
  hero.setTierOverride(getTierOverride);
  hero.supplyFunction("canAim", canAim);
  hero.supplyFunction("canDischargeEnergy", false);
  hero.setHasProperty(hasProperty);

  hero.addAttributeProfile("XKRYPTONITE", inhalerProfile);
  hero.addAttributeProfile("EPROJECTPROFILE", eprojectProfile);
  hero.addAttributeProfile("LANDPROFILE", landProfile);
  hero.addAttributeProfile("kryptonitesickness", kryptonitesicknessProfile);
  hero.addAttributeProfile("bluekryptonite", bluekryptoniteProfile);
  hero.addAttributeProfile("XK", xkryptoniteProfile);
  hero.addAttributeProfile("ABSORB", absorbProfile);
  hero.addAttributeProfile("sun", sunProfile);
  hero.addAttributeProfile("suitup", suitupProfile);
  hero.addAttributeProfile("clap", clapProfile);
  hero.addAttributeProfile("boost", boostProfile);
  hero.addAttributeProfile("boost2", boost2Profile);
  hero.setAttributeProfile(getProfile);
  hero.setDamageProfile(getProfile);
  hero.addDamageProfile("ABSORB", {
    "types": {
      "SUPERCHARGED": 1.0,
      "BLUNT": 0.2
    }
  });
    hero.addDamageProfile("kryptonitesickness", {
        "types": {
            "KRYPTONITE": 0.0125,
            "BLUNT": 0.2
        }
    });
    hero.addDamageProfile("bluekryptonite", {
        "types": {
            "BLUNT": 0.1
        }
    });
hero.addDamageProfile("XK", {
    "properties": {
        "EFFECTS": [{
            "id": "minecraft:saturation",
            "duration": 20,
            "amplifier": 0
        }]
    },
    "types": {
        "XKRYPTONITE": 0.0125,
        "SHARP": 0.75
    }
});

  hero.setTickHandler((entity, manager) => {
    viputils.pinkKryptonitevip(entity, manager);
    landing.tick(entity, manager);
    soft_landing.tick(entity, manager);
    moonFly.moonFly(entity, manager);
    speedsprint.tick(entity, manager);
    kutils.oxygenWeak(entity, manager);
    kutils.kryptoniteWeakness(entity, manager);
    kutils.xkryptoniteInhaler(entity, manager);
    kutils.supermanGlitch(entity, manager);

    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();

    if (entity.getData("fiskheroes:gravity_amount") >= 0) {
      manager.setData(entity, "sl:dyn/abilities_cycle", 1);
    } else if (entity.getData("fiskheroes:gravity_amount") < 0) {
      manager.setData(entity, "sl:dyn/abilities_cycle", 2);
    }

    if (entity.getData("sl:dyn/absorb")) {
      manager.setData(entity, "sl:dyn/absorb", false);
    }

    var oxygen = entity.getData("sl:dyn/oxygen");

    if (entity.getData("sl:dyn/absorb")) {
      manager.setData(entity, "sl:dyn/absorb", false);
    }

    boostutils.flightSL(entity, manager);

    if (
      entity.getData("fiskheroes:beam_shooting") &&
      !entity.getData("sl:dyn/absorb")
    ) {
      manager.setData(entity, "sl:dyn/clap", true);
    } else {
      manager.setData(entity, "sl:dyn/clap", false);
    }

    if (
      entity.getData("fiskheroes:beam_charge") === 0 &&
      entity.getData('fiskheroes:time_since_damaged') > 10.0 &&
      !entity.getData("sl:dyn/hvfloat")
    ) {
      manager.setData(entity, "sl:dyn/hvint", Math.floor(Math.random() < 0.2));
      manager.setData(entity, "sl:dyn/hvfloat", true);
    }

    if (
      entity.getData("fiskheroes:beam_charge") !== 0 ||
      entity.getData('fiskheroes:time_since_damaged') <= 10.0
    ) {
      manager.setData(entity, "sl:dyn/hvfloat", false);
    }
  });
}

function isModifierEnabled(entity, modifier) {
    var b = entity.getData("sl:dyn/blue_kryptonite");
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var coldbreath1 = (breathlevel <= -0.25 && breathlevel > -0.5);
    var coldbreath2 = (breathlevel <= -0.5 && breathlevel > -0.75);
    var coldbreath3 = (breathlevel <= -0.75);
    var superbreath1 = (breathlevel >= 0.25 && breathlevel < 0.5);
    var superbreath2 = (breathlevel >= 0.5 && breathlevel < 0.75);
    var superbreath3 = (breathlevel >= 0.75);
  switch (modifier.name()) {
        case "fiskheroes:regeneration":
            switch (modifier.id()) {
                case "regular":
                    return (!(entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard") || (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.05 && entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard"));
                case "boosted":
                    return (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard" && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.05);
                default:
                    break;
            }
            break;
    case "fiskheroes:water_breathing":
      return entity.getData("sl:dyn/oxygen") < 1;
    case "fiskheroes:speed_disintegration":
      return false;
    case "fiskheroes:super_speed":
      return !entity.getData("fiskheroes:flying");
    case "fiskheroes:heat_vision":
      switch (modifier.id()) {
        case "heatvision":
          return true;
        case "solarflare":
          return false;
        default:
          break;
      }
      break;
        case "fiskheroes:energy_projection":
            switch (modifier.id()) {
                case "base":
                    return !b && !entity.getData("sl:dyn/absorb") && !(breathlevel <= -0.25 || breathlevel >= 0.25);
                case "coldbreath_1":
                    return !b && !entity.getData("sl:dyn/absorb") && breathlevel <= -0.25 && breathlevel > -0.5;
                case "coldbreath_2":
                    return !b && !entity.getData("sl:dyn/absorb") && breathlevel <= -0.5 && breathlevel > -0.75;
                case "coldbreath_3":
                    return !b && !entity.getData("sl:dyn/absorb") && breathlevel <= -0.75;
                case "superbreath_1":
                    return !b && !entity.getData("sl:dyn/absorb") && breathlevel >= 0.25 && breathlevel < 0.5;
                case "superbreath_2":
                    return !b && !entity.getData("sl:dyn/absorb") && breathlevel >= 0.5 && breathlevel < 0.75;
                case "superbreath_3":
                    return !b && !entity.getData("sl:dyn/absorb") && breathlevel >= 0.75;
                default:
                    break;
            }
            break;
    case "fiskheroes:controlled_flight":
      switch (modifier.id()) {
        case "normal":
          return !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/notonmoon");
        case "normalboosted":
          return entity.getData("sl:dyn/sboost");
        case "superchargedboosted":
          return entity.getData("sl:dyn/sboost2");
        case "supercharged":
          return entity.getData("sl:dyn/absorb") && !entity.getData("sl:dyn/sboost2");
        default:
          break;
      }
      break;
    case "fiskheroes:charged_beam":
      switch (modifier.id()) {
        case "thunderclap":
          return !entity.getData("sl:dyn/absorb");
        case "solarblast":
          return entity.getData("sl:dyn/absorb_timer") == 1;
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
    var b = entity.getData("sl:dyn/blue_kryptonite");
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var es_charge = entity.getData("sl:dyn/es_charge");
  switch (keyBind) {
        case "XKRYPTONITE":
            return (
                entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_inhaler" &&
                !entity.getData("sl:dyn/xkryptonite") &&
                entity.getData("sl:dyn/xkryptonite_cooldown") === 0
            );
case "HEAT_VISION":
    if (!entity.getData("fiskheroes:mask_open")) {
        return entity.getData("fiskheroes:beam_charge") == 0 
            && entity.getData("sl:dyn/heat_vision_charge") >= 1 
            && !entity.getData("sl:dyn/sboost") 
            && !entity.getData("sl:dyn/sboost2");
    } else {
        return entity.getData("fiskheroes:mask_open_timer2") == 1 
            && !entity.getData("fiskheroes:beam_shooting");
    }

case "heat_vision_unavailable":
    if (entity.getData("sl:dyn/heat_vision")) {
        if (entity.getData("fiskheroes:mask_open") 
            || entity.getData("fiskheroes:energy_projection") 
            || entity.getData("sl:dyn/sboost")) {
            return true;
        } else {
            if (entity.getData("fiskheroes:beam_charge") === 0) {
                if (entity.getData('fiskheroes:time_since_damaged') > 10.0) {
                    return false;
                } else {
                    if (entity.getData("sl:dyn/hvint") === 0) {
                        return false;
                    }
                }
            }
            return true;
        }
    } else {
        if (entity.getData("fiskheroes:mask_open") 
            || entity.getData("fiskheroes:energy_projection") 
            || entity.getData("sl:dyn/sboost") 
            && entity.getData("sl:dyn/heat_vision_charge") == 0) {
            return true;
        } else {
            if (entity.getData("fiskheroes:beam_charge") === 0) {
                if (entity.getData('fiskheroes:time_since_damaged') > 10.0 
                    && entity.getData("sl:dyn/heat_vision_charge") == 0) {
                    return false;
                } else {
                    if (entity.getData("sl:dyn/hvint") === 0 
                        && entity.getData("sl:dyn/heat_vision_charge") == 0) {
                        return false;
                    }
                }
            }
            return true;
        }
    }

case "HV_CHARGE":
    if (entity.getData("sl:dyn/heat_vision")) {
        if (entity.getData("fiskheroes:mask_open") 
            || entity.getData("fiskheroes:energy_projection") 
            || entity.getData("sl:dyn/sboost")) {
            return false;
        } else {
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
    } else {
        if (entity.getData("fiskheroes:mask_open") 
            || entity.getData("fiskheroes:energy_projection") 
            || entity.getData("sl:dyn/sboost") 
            && entity.getData("sl:dyn/heat_vision_charge") == 0) {
            return false;
        } else {
            if (entity.getData("fiskheroes:beam_charge") === 0) {
                if (entity.getData('fiskheroes:time_since_damaged') > 10.0 
                    && entity.getData("sl:dyn/heat_vision_charge") == 0) {
                    return true;
                } else {
                    if (entity.getData("sl:dyn/hvint") === 0 
                        && entity.getData("sl:dyn/heat_vision_charge") == 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    }


    case "SUPER_SPEED":
      return !entity.getData("fiskheroes:flight_boost_timer") > 0;

    case "REMOVEPUNCH":
        return entity.getData("fiskheroes:beam_charging");

        case "energy_proj_unavailable":
            return !entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && entity.getData("sl:dyn/oxygen") > 0.8 

            case "ENERGY_PROJECTION":
                if (entity.getData("sl:dyn/oxygen") > 0.8) {
                    return !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/oxygen") < 1 && entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost") && !(breathlevel >= -0.25 && breathlevel < 0.25);
                } else {
                    return !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/oxygen") < 1 && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost") && !(breathlevel >= -0.25 && breathlevel < 0.25);
                }

            case "GRAVITY_MANIPULATION":
                if (entity.getData("sl:dyn/oxygen") > 0.8) {
                    return !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/oxygen") < 1 && entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost");
                } else {
                    return !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/oxygen") < 1 && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost");
                }

    case "ABSORB":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.getData("sl:dyn/absorb") && !entity.isSneaking() && !entity.isOnGround() && entity.getData("sl:dyn/absorb_cooldown") == 0;
      } else {
        return entity.getData("fiskheroes:energy_charge") === 0.0;
      }

    case "suitup":
      return !entity.getData("sl:dyn/absorb") && entity.isSneaking() && entity.getData("fiskheroes:energy_charge") == 1.0;

    case "GROUND_SMASH":
      return entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:mask_open");

    case "THUNDERCLAPNAME":
      return !entity.isSneaking() && !entity.getData("sl:dyn/absorb") && entity.getData("flight_boost_timer") === 0;

    case "SOLARFLARENAME":
      return entity.getData("sl:dyn/absorb");

    case "CHARGED_BEAM":
      if (!entity.getData("sl:dyn/absorb")) {
        return !entity.isSneaking() && entity.getData("flight_boost_timer") === 0 && !(entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_inhaler" || entity.getHeldItem().nbt().getString('WeaponType') === "sl:used_inhaler");
      } else {
        return true;
      }

    case "boost":
      return entity.getData("fiskheroes:flight_boost_timer") > 0 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/absorb");

    case "boost2":
      return entity.getData("fiskheroes:flight_boost_timer") > 0 && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/absorb");

    default:
      return true;
  }
}

function getProfile(entity) {
  if (entity.getData("sl:dyn/xkryptonite_timer") == 1) {
    return "XKRYPTONITE";
  }
  if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard") {
    return "XK";
  }
  if (entity.getData("fiskheroes:energy_projection")) {
    return "EPROJECTPROFILE";
  }
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.2) {
    return "kryptonitesickness";
  }
  if (entity.getData("sl:dyn/clap")) {
    return "clap";
  }
  if (entity.getData("sl:dyn/absorb")) {
    return "ABSORB";
  } 
  if (entity.getData("sl:dyn/sboost")) {
    return "boost";
  } 
  if (entity.getData("sl:dyn/sboost2")) {
    return "boost2";
  } 
  if (entity.getData("sl:dyn/sun")) {
    return "sun";
  } 
  if (entity.getData("sl:dyn/suitup")) {
    return "suitup";
  } 
  if (entity.getData("sl:dyn/blue_kryptonite")) {
    return "bluekryptonite";
  }
  return null;
}


function absorbProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("PUNCH_DAMAGE", 17.0, 0);
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
function xkryptoniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function landProfile(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -100.0, 0);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 2);
}

function eprojectProfile(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -0.5, 0);
    profile.addAttribute("SPRINT_SPEED", -0.285, 1);
}

function kryptonitesicknessProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
    profile.revokeAugments();
}
function bluekryptoniteProfile(profile) {
    profile.revokeAugments();
}
function inhalerProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12.0, 0);
}
function sunProfile(profile) {
  profile.inheritDefaults();
}
function clapProfile(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -100.0, 0);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 2);
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
  if (entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.1 ) {
    return 10;
  }
  
  if (entity.getData("sl:dyn/suitup") && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.1 ) {
    return 8;
  }

  if (entity.getData("sl:dyn/kryptonite_sickness_timer") > 0.1 ) {
    return 6;
  }

  if (entity.getData("sl:dyn/blue_kryptonite")) {
    return 1;
  }
  
  return 9;
}

function hasProperty(entity, property) {
  switch (property) {
    case "MASK_TOGGLE":
      return entity.getData('fiskheroes:time_since_damaged') > 10.0;
    case "BREATHE_SPACE":
      return entity.getData("sl:dyn/oxygen") < 1;
    default:
      return false;
  }
}