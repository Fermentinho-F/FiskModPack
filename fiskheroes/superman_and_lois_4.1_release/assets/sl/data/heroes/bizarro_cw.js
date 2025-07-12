var landing = implement("sl:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var utils = implement("fiskheroes:external/utils");
var boostutils = implement("sl:external/boost_utils");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");
var kutils = implement("sl:external/kryptonian_utils");

function init(hero) {
  hero.setName("Bizarro/\u00A7c\u00A7lAP 7\u00A7r");
  hero.setVersion("Earth-Prime");
  hero.setTier(9);

  hero.setDefaultScale(0.99);

  hero.setHelmet("item.superhero_armor.piece.hair");
  hero.setChestplate("item.superhero_armor.piece.chestpiece");
  hero.setLeggings("Skirt");
  hero.setBoots("item.superhero_armor.piece.boots");

  hero.addPowers("sl:inverse_kryptonian_physiology_cw");
  hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
  hero.addAttribute("WEAPON_DAMAGE", -2.4, 0);
  hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
  hero.addAttribute("SPRINT_SPEED", 0.4, 1);
  hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);
  hero.addAttribute("KNOCKBACK", 2.0, 0);
  hero.addAttribute("MAX_HEALTH", 2.0, 0);
  hero.addAttribute("IMPACT_DAMAGE", 0.9, 1);

  hero.addKeyBind("REMOVEPUNCH", "key.reload", -1);
  hero.addKeyBind("HV_CHARGE", "Cold Vision", 1);
  hero.addKeyBind("heat_vision_unavailable", "\u00A7mCold Vision", 1);
  hero.addKeyBind("HEAT_VISION", "Cold Vision", 1);
  hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
  hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
  hero.addKeyBind("ENERGY_PROJECTION", "Heat Breath", 4);
  hero.addKeyBind("GRAVITY_MANIPULATION", "Heat Breath", 4);
  hero.addKeyBind("HB_CHARGE", "Heat Breath", 4);
  hero.addKeyBind("CHARGED_BEAM", "Thunderclap", 5);
  hero.addKeyBind("boost", "Boost", 2);
  hero.addKeyBind("boost2", "Boost", 2);

  hero.addSoundEvent("PUNCH", "sl:inversepunch");
  hero.addSoundEvent("AIM_START", "sl:hvcharge_cw");
  hero.addSoundEvent("MASK_OPEN", ["sl:heat_vision_idle", "sl:hvcharge_cw_conditionless"]);
  hero.addSoundEvent("MASK_CLOSE", "sl:cw_hv_end_mask");

  hero.setKeyBindEnabled(isKeyBindEnabled);
  hero.setModifierEnabled(isModifierEnabled);
  hero.setTierOverride(getTierOverride);
  hero.supplyFunction("canAim", canAim);
  hero.supplyFunction("canDischargeEnergy", false);
  hero.setHasProperty(hasProperty);

  hero.addAttributeProfile("KRYPTONITE", kryptoniteProfile);
  hero.addAttributeProfile("EPROJECTPROFILE2", eprojectProfile2);
  hero.addAttributeProfile("EPROJECTPROFILE", eprojectProfile);
  hero.addAttributeProfile("LANDPROFILE", landProfile);
  hero.addAttributeProfile("ABSORB", absorbProfile);
  hero.addAttributeProfile("sun", sunProfile);
  hero.addAttributeProfile("suitup", suitupProfile);
  hero.addAttributeProfile("clap", clapProfile);
  hero.addAttributeProfile("boost", boostProfile);
  hero.addAttributeProfile("boost2", boost2Profile);
  hero.addAttributeProfile("kryptonitesickness", kryptonitesicknessProfile);
  hero.addAttributeProfile("XK", xkryptoniteProfile);
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
    landing.tick(entity, manager);
    soft_landing.tick(entity, manager);
    moonFly.moonFly(entity, manager);
    speedsprint.tick(entity, manager);
    kutils.bluekryptoniteWeakness(entity, manager);
    kutils.inversesupercharge(entity, manager);
    boostutils.flightSL(entity, manager);
    kutils.oxygenStrongInverse(entity, manager);
    kutils.heatBreath(entity, manager);
    kutils.kryptoniteInhaler(entity, manager);

    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();
    var gravitylevel = entity.getData("fiskheroes:gravity_amount");

    if (entity.getData("sl:dyn/absorb")) {
      manager.setData(entity, "sl:dyn/absorb", false);
    }

    var oxygen = entity.getData("sl:dyn/oxygen");

    if (dim !== 2595) {
      manager.setData(entity, "sl:dyn/notonmoon", true);
    } else {
      manager.setData(entity, "sl:dyn/notonmoon", false);
    }

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
    var breathlevel = entity.getData("sl:dyn/heat_breath_level");
    var breathlevel2 = entity.getData("fiskheroes:gravity_amount");
  switch (modifier.name()) {
        case "fiskheroes:regeneration":
            switch (modifier.id()) {
                case "regular":
                    return (!(entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard") || (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.05 && entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard"));
                case "boosted":
                    return (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard" && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.05);
                default:
                    break;
            }
            break;
    case "fiskheroes:speed_disintegration":
      return false;
    case "fiskheroes:super_speed":
      return !entity.getData("fiskheroes:flying");
    case "fiskheroes:heat_vision":
      switch (modifier.id()) {
        case "heatvision":
          return !entity.getData("sl:dyn/absorb") && !entity.getData("sl:dyn/sboost");
        case "solarflare":
          return entity.getData("sl:dyn/absorb_timer") == 1 && !entity.getData("sl:dyn/sboost2");
        default:
          break;
      }
      break;
        case "fiskheroes:energy_projection":
            switch (modifier.id()) {
                case "base":
                    return !entity.getData("sl:dyn/inverseabsorb") && !(breathlevel2 <= -0.25 || breathlevel2 >= 0.25);
                case "heatbreath_1":
                    return !entity.getData("sl:dyn/inverseabsorb") && breathlevel <= -0.25 && breathlevel > -0.5;
                case "heatbreath_2":
                    return !entity.getData("sl:dyn/inverseabsorb") && breathlevel <= -0.5 && breathlevel > -0.75;
                case "heatbreath_3":
                    return !entity.getData("sl:dyn/inverseabsorb") && breathlevel <= -0.75;
                case "superbreath_1":
                    return !entity.getData("sl:dyn/inverseabsorb") && breathlevel2 >= 0.25 && breathlevel2 < 0.5;
                case "superbreath_2":
                    return !entity.getData("sl:dyn/inverseabsorb") && breathlevel2 >= 0.5 && breathlevel2 < 0.75;
                case "superbreath_3":
                    return !entity.getData("sl:dyn/inverseabsorb") && breathlevel2 >= 0.75;
                default:
                    break;
            }
            break;
    case "fiskheroes:controlled_flight":
      switch (modifier.id()) {
        case "normal":
          return !entity.getData("sl:dyn/absorb") && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/notonmoon");
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
var breathlevel = entity.getData("sl:dyn/heat_breath_level");
var es_charge = entity.getData("sl:dyn/es_charge")
var notboosting = !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/sboost2")
  switch (keyBind) {
        case "KRYPTONITE":
            return (
                entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_inhaler" &&
                !entity.getData("sl:dyn/kryptonite") &&
                entity.getData("sl:dyn/kryptonite_cooldown") === 0
            );
case "HB_CHARGE":
  if (entity.getData("sl:dyn/heat_breath")) {
    if (entity.getData("sl:dyn/oxygen") > 0.8) {
      return !entity.getData("sl:dyn/inverseabsorb") 
             && entity.getData("sl:dyn/oxygen") < 1 
             && entity.getData("fiskheroes:energy_projection") 
             && !entity.getData("fiskheroes:beam_charging") 
             && !entity.getData("fiskheroes:heat_vision") 
             && !entity.getData("sl:dyn/sboost") 
             && !(breathlevel >= -0.25 && breathlevel < 0.25) 
             && entity.getData("sl:dyn/heat_breath_level") <= 0;
    } else {
      return !entity.getData("sl:dyn/inverseabsorb") 
             && entity.getData("sl:dyn/oxygen") < 1 
             && !entity.getData("fiskheroes:beam_charging") 
             && !entity.getData("fiskheroes:heat_vision") 
             && !entity.getData("sl:dyn/sboost") 
             && !(breathlevel >= -0.25 && breathlevel < 0.25) 
             && entity.getData("sl:dyn/heat_breath_level") <= 0;
    }
  } else {
    if (entity.getData("sl:dyn/oxygen") > 0.8) {
      return !entity.getData("sl:dyn/inverseabsorb") 
             && entity.getData("sl:dyn/heat_breath_charge") == 0 
             && entity.getData("sl:dyn/oxygen") < 1 
             && entity.getData("fiskheroes:energy_projection") 
             && !entity.getData("fiskheroes:beam_charging") 
             && !entity.getData("fiskheroes:heat_vision") 
             && !entity.getData("sl:dyn/sboost") 
             && !(breathlevel >= -0.25 && breathlevel < 0.25) 
             && entity.getData("sl:dyn/heat_breath_level") <= 0;
    } else {
      return !entity.getData("sl:dyn/inverseabsorb") 
             && entity.getData("sl:dyn/heat_breath_charge") == 0 
             && entity.getData("sl:dyn/oxygen") < 1 
             && !entity.getData("fiskheroes:beam_charging") 
             && !entity.getData("fiskheroes:heat_vision") 
             && !entity.getData("sl:dyn/sboost") 
             && !(breathlevel >= -0.25 && breathlevel < 0.25) 
             && entity.getData("sl:dyn/heat_breath_level") <= 0;
    }
  }

	case "ENERGY_PROJECTION":
 	 if (entity.getData("sl:dyn/oxygen") > 0.8) {
   	 return !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/oxygen") < 1 && entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !	entity.getData("sl:dyn/sboost") && (entity.getData("sl:dyn/heat_breath_charge") == 1 || (entity.getData("sl:dyn/heat_breath_level") > 0 && entity.getData("sl:dyn/heat_breath_charge") == 0));
  	} else {
    	return !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/oxygen") < 1 && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost") && (entity.getData("sl:dyn/heat_breath_charge") == 1 || (entity.getData("sl:dyn/heat_breath_level") > 0 && entity.getData("sl:dyn/heat_breath_charge") == 0));
  	}

	case "GRAVITY_MANIPULATION":
	    if (!entity.getData("sl:dyn/sboost")) {
	        if (entity.getData("sl:dyn/heat_breath")) {
	            if (entity.getData("sl:dyn/heat_breath_level") < 0) {
	                return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging");
	            } else {
	                return !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging");
	            }
	        } else {
	            if (entity.getData("sl:dyn/heat_breath_level") < 0) {
	                return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging");
	            } else {
	                return entity.getData("sl:dyn/heat_breath_charge") <= 0 && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging");
	            }
	        }
	    }

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

    case "ENERGY_PROJECTION":
      return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost");

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
            if (!entity.getData("sl:dyn/inverseabsorb")) {
                return entity.getData("flight_boost_timer") === 0 && !entity.isSneaking() && entity.getData("fiskheroes:energy_charge") == 0 && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3 && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:kryptonite_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler";
            } else {
                return !entity.getData("sl:dyn/sboost2") && !entity.getData("fiskheroes:mask_open") && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
            }


    case "boost":
      return entity.getData("fiskheroes:flight_boost_timer") == 1 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/absorb");

    case "boost2":
      return entity.getData("fiskheroes:flight_boost_timer") == 1 && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/absorb");

    default:
      return true;
  }
}

function getProfile(entity) {
  if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard") {
    return "XK";
  }
  if (entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/heat_breath_level") > 0) {
    return "EPROJECTPROFILE";
  } else if (entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/heat_breath_level") < 0){
    return "EPROJECTPROFILE2";
  }
  if (entity.getData("sl:dyn/kryptonite_timer") == 1) {
    return "KRYPTONITE";
  }
  if (entity.getData("sl:dyn/absorb")) {
    return "ABSORB";
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
  } else if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.2) {
    return "kryptonitesickness";
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

function eprojectProfile2(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -0.5, 0);
    profile.addAttribute("SPRINT_SPEED", -0.4, 1);
    profile.addAttribute("BASE_SPEED", -0.4, 2);
}

function sunProfile(profile) {
  profile.inheritDefaults();
}

function xkryptoniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function kryptoniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12.0, 0);
}

function kryptonitesicknessProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
    profile.revokeAugments();
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
  if (entity.getData("sl:dyn/absorb")) {
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
      return entity.getData("sl:dyn/oxygen") < 1;
    default:
      return false;
  }
}
