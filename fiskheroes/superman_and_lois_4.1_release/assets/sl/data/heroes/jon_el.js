var landing = implement("sl:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var utils = implement("fiskheroes:external/utils");
var boostutils = implement("sl:external/boost_utils");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");
var kutils = implement("sl:external/kryptonian_utils");

function init(hero) {
    hero.setName("Superboy/\u00A7c\u00A7lAP 6\u00A7r");
    hero.setVersion("Jon-El");
    hero.setTier(8);

    hero.setHelmet("Earrings");
    hero.setChestplate("Jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sl:inverse_kryptonian_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", -2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);
    hero.addAttribute("KNOCKBACK", 1.0, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.6, 1);

    hero.addKeyBind("REMOVEPUNCH", "REMOVEPUNCH", -1);
    hero.addKeyBind("HV_CHARGE", "Cold Vision", 1);
    hero.addKeyBind("HEAT_VISION", "Cold Vision", 1);
    hero.addKeyBind("HEAT_VISION", "Cold Vision", 1);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
    hero.addKeyBind("HB_CHARGE", "Heat Breath", 4);
    hero.addKeyBind("ENERGY_PROJECTION", "Heat Breath", 4);
    hero.addKeyBind("GRAVITY_MANIPULATION", "Heat Breath", 4);
    hero.addKeyBind("CHARGED_BEAM", "Thunderclap", 5);
    hero.addKeyBind("ABSORB", "Supercharge", 5);
    hero.addKeyBind("boost", "Boost", 2);
    hero.addKeyBind("boost2", "Boost", 2);
  hero.addKeyBind("GROUND_SMASH", "\u00A76\u00A7lEarth Smash - 100 Percent", 5);
  hero.addKeyBind("0", "\u00A76\u00A7lEarth Smash - 0 Percent", 5);
  hero.addKeyBind("25", "\u00A76\u00A7lEarth Smash - 25 Percent", 5);
  hero.addKeyBind("50", "\u00A76\u00A7lEarth Smash - 50 Percent", 5);
  hero.addKeyBind("75", "\u00A76\u00A7lEarth Smash - 75 Percent", 5);
  hero.addKeyBind("100", "\u00A76\u00A7lEarth Smash - 100 Percent", 5);
    hero.addKeyBind("KRYPTONITE", "Consume Kryptonite Vial", 5);

    hero.addSoundEvent("MASK_OPEN", ["sl:heat_vision_idle", "sl:hvcharge_conditionless"]);
    hero.addSoundEvent("MASK_CLOSE", "sl:hv_end_mask");
    hero.addSoundEvent("AIM_START", "sl:icevision_charge");

    hero.addSoundEvent("PUNCH", "sl:inversepunch");

    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setTierOverride(getTierOverride);

    hero.addAttributeProfile("KRYPTONITE", kryptoniteProfile);
    hero.addAttributeProfile("EPROJECTPROFILE2", eprojectProfile2);
    hero.addAttributeProfile("EPROJECTPROFILE", eprojectProfile);
    hero.addAttributeProfile("LANDPROFILE", landProfile);
    hero.addAttributeProfile("kryptonitesickness", kryptonitesicknessProfile);
    hero.addAttributeProfile("sun", sunProfile);
    hero.addAttributeProfile("ABSORB", absorbProfile);
    hero.addAttributeProfile("clap", clapProfile);
    hero.setAttributeProfile(getProfile);

    hero.setTickHandler((entity, manager) => {
    landing.tick(entity, manager);
    soft_landing.tick(entity, manager);
    moonFly.moonFly(entity, manager);
    speedsprint.tick(entity, manager);
    kutils.xkryptoniteWeakness(entity, manager);
    kutils.inversesupercharge(entity, manager);
    boostutils.flightSL(entity, manager);
    kutils.oxygenStrongInverse(entity, manager);
    kutils.supermanGlitch(entity, manager);
    kutils.heatBreath(entity, manager);
    kutils.kryptoniteInhaler(entity, manager);

    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();
    var gravitylevel = entity.getData("fiskheroes:gravity_amount");

    var ls = entity.getData("sl:dyn/lightonoff");
    var l = entity.getData("sl:dyn/light");
    if (l >=1) {
      manager.setInterpolatedData(entity, "sl:dyn/lightonoff", true)
    };
    if (l <=0) {
        manager.setInterpolatedData(entity, "sl:dyn/lightonoff", false)
    };
    manager.incrementData(entity, "sl:dyn/light", 20, !ls);

  if (
    entity.getData("sl:dyn/heat_breath_charge") === 0 &&
    entity.getData('fiskheroes:time_since_damaged') > 10.0 &&
    !entity.getData("sl:dyn/hvfloat")
  ) {
    manager.setData(entity, "sl:dyn/hvint", Math.floor(Math.random() < 0.2));
    manager.setData(entity, "sl:dyn/hvfloat", true);
  }

  if (
    entity.getData("sl:dyn/heat_breath_charge") !== 0 ||
    entity.getData('fiskheroes:time_since_damaged') <= 10.0
  ) {
    manager.setData(entity, "sl:dyn/hvfloat", false);
  }

  if (
    entity.getData("fiskheroes:beam_shooting") &&
    !entity.getData("sl:dyn/inverseabsorb")
  ) {
    manager.setData(entity, "sl:dyn/clap", true);
  } else {
    manager.setData(entity, "sl:dyn/clap", false);
  }

  if (entity.isOnGround() && !entity.isSneaking() && !entity.getData("sl:dyn/inverseabsorb")) {
    manager.setData(entity, "sl:dyn/abilities_cycle", 1);
  } else if (entity.getData("sl:dyn/inverseabsorb")) {
    manager.setData(entity, "sl:dyn/abilities_cycle", 2);
  } else {
    manager.setData(entity, "sl:dyn/abilities_cycle", 1);
  }

    });
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
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
        case "fiskheroes:damage_immunity":
        case "fiskheroes:projectile_immunity":
            return entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
        case "fiskheroes:super_speed":
            return !entity.getData("fiskheroes:flying");
        case "fiskheroes:speed_disintegration":
            return entity.getData("sl:dyn/test");
        case "fiskheroes:heat_vision":
            switch (modifier.id()) {
                case "heatvision":
                    return !entity.getData("sl:dyn/inverseabsorb");
                case "solarflare":
                    return entity.getData("sl:dyn/inverseabsorb");
                default:
                    break;
            }
            break;
        case "fiskheroes:controlled_flight":
            switch (modifier.id()) {
                case "normal":
                    return (
                        !entity.getData("sl:dyn/inverseabsorb") &&
                        !entity.getData("sl:dyn/sboost") &&
                        !entity.getData("sl:dyn/sboost2")
                    );
                case "normalboosted":
                    return entity.getData("sl:dyn/sboost");
                case "superchargedboosted":
                    return entity.getData("sl:dyn/sboost2");
                case "supercharged":
                    return entity.getData("sl:dyn/inverseabsorb") && !entity.getData("sl:dyn/sboost2");
                default:
                    break;
            }
            break;
        case "fiskheroes:charged_beam":
            switch (modifier.id()) {
                case "thunderclap":
                    return !entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/abilities_cycle") == 1;
                case "solarblast":
                    return entity.getData("sl:dyn/inverseabsorb") && entity.getData("sl:dyn/abilities_cycle") == 2;
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
        case "CHARGED_BEAM":
            if (!entity.getData("sl:dyn/inverseabsorb")) {
                return entity.getData("flight_boost_timer") === 0 && !entity.isSneaking() && entity.getData("fiskheroes:energy_charge") == 0 && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3 && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:kryptonite_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler";
            } else {
                return !entity.getData("sl:dyn/sboost2") && !entity.getData("fiskheroes:mask_open") && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
            }

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

        case "HV_CHARGE":
            return !entity.getData("sl:dyn/sboost") && !entity.getData("fiskheroes:mask_open");

        case "HEAT_VISION":
            if (!entity.getData("fiskheroes:mask_open")) {
                return entity.getData("sl:dyn/heat_vision_charge") === 1;
            } else {
                return !entity.getData("sl:dyn/sboost");
            }

        case "ABSORB":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.getData("sl:dyn/inverseabsorb") && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:kryptonite_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler" && !entity.isSneaking() && entity.getData("flight_boost_timer") > 0 && entity.getData("sl:dyn/inverseabsorb_cooldown") == 0 || entity.getData("fiskheroes:energy_charge") === 1.0;
      } else {
        return entity.getData("fiskheroes:energy_charge") === 1.0 && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:kryptonite_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler";
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

        case "0":
            return es_charge < 0.25 && entity.getData("sl:dyn/inverseabsorb") && !entity.getData("fiskheroes:mask_open");

        case "25":
            return es_charge > 0.25 && es_charge < 0.5 && !entity.getData("fiskheroes:mask_open");

        case "50":
            return es_charge > 0.5 && es_charge < 0.75 && !entity.getData("fiskheroes:mask_open");

        case "75":
            return es_charge > 0.75 && es_charge < 1 && !entity.getData("fiskheroes:mask_open");

        case "100":
            return es_charge > 1 && !entity.getData("fiskheroes:mask_open");
        case "GROUND_SMASH":
            return entity.getData("sl:dyn/inverseabsorb") && !entity.getData("fiskheroes:mask_open") && es_charge > 1;
        case "SUPER_SPEED":
            return !entity.getData("fiskheroes:flight_boost_timer") > 0;
        case "REMOVEPUNCH":
            return entity.getData("fiskheroes:beam_charging");
        case "boost":
            return (
                entity.getData("fiskheroes:flight_boost_timer") > 0 &&
                !entity.getData("sl:dyn/sboost") &&
                !entity.getData("sl:dyn/inverseabsorb")
            );
        case "boost2":
            return (
                entity.getData("fiskheroes:flight_boost_timer") > 0 &&
                !entity.getData("sl:dyn/sboost2") &&
                entity.getData("sl:dyn/inverseabsorb")
            );
        default:
            return true;
    }
}

function getProfile(entity) {
  if (entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/heat_breath_level") > 0) {
    return "EPROJECTPROFILE";
  } else if (entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/heat_breath_level") < 0){
    return "EPROJECTPROFILE2";
  }
  if (entity.getData("sl:dyn/kryptonite_timer") == 1) {
    return "KRYPTONITE";
  }
  if (entity.getData("sl:dyn/inverseabsorb")) {
    return "ABSORB";
  } else if (entity.getData("sl:dyn/sun")) {
    return "sun";
  } else if (entity.getData("sl:dyn/soft_landing_timer") > 0) {
    return "LANDPROFILE";
  } else if (entity.getData("sl:dyn/clap")) {
    return "clap";
  } else if (entity.getData("sl:dyn/soft_landing_timer") > 0) {
    return "LANDPROFILE";
  } else if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.2) {
    return "kryptonitesickness";
  }
  return null;
}

function kryptonitesicknessProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
    profile.revokeAugments();
}

function landProfile(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -100.0, 0);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 2);
}

function absorbProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 14.5, 0);
    profile.addAttribute("KNOCKBACK", 3.0, 0);
    profile.addAttribute("BASE_SPEED_LEVELS", 4.8, 0);
    profile.addAttribute("IMPACT_DAMAGE", 2.0, 1);
}

function clapProfile(profile) {
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

function kryptoniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 13.0, 0);
}

function canAim(entity) {
    if (entity.getData("sl:dyn/heat_breath_charge") === 0) {
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

function hasProperty(entity, property) {
    return true;
}
function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return true;
        case "BREATHE_SPACE":
            return true;
        default:
            return false;
    }
}
function getTierOverride(entity) {
  if (entity.getData("sl:dyn/inverseabsorb")) {
    return 10;
  }
  return 9;
}

