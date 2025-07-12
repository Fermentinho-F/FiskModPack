var landing = implement("sl:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var utils = implement("fiskheroes:external/utils");
var boostutils = implement("sl:external/boost_utils");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");
var kutils = implement("sl:external/kryptonian_utils");

function init(hero) {
  hero.setName("Tal-Rho/\u00A7c\u00A7lAP 8\u00A7r");
  hero.setTier(9);
  hero.hide();

  hero.setDefaultScale(1.0);

  hero.setChestplate("item.superhero_armor.piece.chestpiece");
  hero.setLeggings("item.superhero_armor.piece.pants");
  hero.setBoots("item.superhero_armor.piece.boots");

  hero.addPowers("sl:kryptonian_physiology");
  hero.addAttribute("PUNCH_DAMAGE", 13.0, 0);
  hero.addAttribute("WEAPON_DAMAGE", -2.2, 0);
  hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
  hero.addAttribute("SPRINT_SPEED", 0.55, 1);
  hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);
  hero.addAttribute("KNOCKBACK", 2.0, 0);
  hero.addAttribute("MAX_HEALTH", 2.0, 0);
  hero.addAttribute("IMPACT_DAMAGE", 0.9, 1);

  hero.addKeyBind("REMOVEPUNCH", "removepunch", -1);
  hero.addKeyBind("HV_CHARGE", "key.heatVision", 1);
  hero.addKeyBind("HEAT_VISION", "key.heatVision", 1);
  hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
  hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
  hero.addKeyBind("energy_proj_unavailable", "\u00A7mSuper Breath", 4);
  hero.addKeyBind("ENERGY_PROJECTION", "Super Breath", 4);
  hero.addKeyBind("GRAVITY_MANIPULATION", "Super Breath", 4);
  hero.addKeyBind("CHARGED_BEAM", "\u00A7c\u00A7mUnavailable", 1);
  hero.addKeyBind("ABSORB", "Supercharge", 5);
  hero.addKeyBind("boost", "Boost", 2);
  hero.addKeyBind("boost2", "Boost", 2);
  hero.addKeyBind("0", "\u00A76\u00A7lEarth Smash - 0 Percent", 5);
  hero.addKeyBind("51", "\u00A76\u00A7lEarth Smash - 25 Percent", 5);
  hero.addKeyBind("50", "\u00A76\u00A7lEarth Smash - 50 Percent", 5);
  hero.addKeyBind("75", "\u00A76\u00A7lEarth Smash - 75 Percent", 5);
  hero.addKeyBind("100", "\u00A76\u00A7lEarth Smash - 100 Percent", 5);
  hero.addKeyBind("GROUND_SMASH", "\u00A76\u00A7lEarth Smash - 100 Percent", 5);

  hero.addKeyBind("VTHUNDERCLAP", "Thunderclap", 1);
  hero.addKeyBind("THESOLARFLARE", "\u00A74\u00A7lSolar Flare", 1);
  hero.addKeyBind("suitup", "Suit Up", 5);

  hero.addSoundEvent("EQUIP", "sl:supercharged_idle_loop");
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

  hero.addAttributeProfile("EPROJECTPROFILE", eprojectProfile);
  hero.addAttributeProfile("LANDPROFILE", landProfile);
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

hero.setTickHandler((entity, manager) => {

  var ls = entity.getData("sl:dyn/lightonoff");
  var l = entity.getData("sl:dyn/light");
  if (l >=1) {
    manager.setInterpolatedData(entity, "sl:dyn/lightonoff", true)
  };
  if (l <=0) {
      manager.setInterpolatedData(entity, "sl:dyn/lightonoff", false)
  };
  manager.incrementData(entity, "sl:dyn/light", 20, !ls);

        var item3 = entity.getEquipmentInSlot(3);
        var item2 = entity.getEquipmentInSlot(2);
        var item1 = entity.getEquipmentInSlot(1);
    var supercharged_string = item1.nbt().getBoolean("supercharged_string");

    if (item1.nbt().getBoolean("supercharged_string")) {
      manager.setData(entity, "sl:dyn/absorb", true);
  } else {
      manager.setData(entity, "sl:dyn/absorb", false);
  }

    if (entity.getUUID() == !item1.nbt().getString("OwnerName")) {
        manager.setBoolean(item1.nbt(), "supercharged_string", false);
    } 

var item3 = entity.getEquipmentInSlot(3);

if (!entity.getData("sl:dyn/absorb") && item3.nbt().getString('HeroType') === "sl:talrho_supercharged") {
    var item2 = entity.getEquipmentInSlot(2);
    var item1 = entity.getEquipmentInSlot(1);

    manager.setString(item1.nbt(), "HeroType", "sl:talrho");
    manager.setString(item2.nbt(), "HeroType", "sl:talrho");
    manager.setString(item3.nbt(), "HeroType", "sl:talrho");

    if (!entity.as("PLAYER").isCreativeMode()) {
        manager.setBoolean(item3.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item2.nbt(), "NeedsUnlock", true);
        manager.setBoolean(item1.nbt(), "NeedsUnlock", true);
    }
}

    if (entity.getData("sl:dyn/absorb_cooldown") < 0.05) {
        manager.setData(entity, "fiskheroes:flying", true);
    }

    if (entity.getData("sl:dyn/absorb_cooldown") == 1) {
        manager.setBoolean(item1.nbt(), "supercharged_string", false);
    }

  landing.tick(entity, manager);
  soft_landing.tick(entity, manager);
  moonFly.moonFly(entity, manager);
  speedsprint.tick(entity, manager);
  kutils.oxygenStrong(entity, manager);

  var x = entity.posX();
  var y = entity.posY();
  var z = entity.posZ();
  var dim = entity.world().getDimension();

    var es_charge = entity.getData("sl:dyn/es_charge")

    var oxygen = entity.getData("sl:dyn/oxygen");

    if (!entity.getData("sl:dyn/absorb")) {
      manager.setData(entity, "sl:dyn/es_charge", 0);
    }

    if (entity.getData("sl:dyn/sboost2")) {
      manager.setData(entity, "sl:dyn/es_charge", es_charge + 0.00125);
    }

  if (entity.getData("fiskheroes:beam_shooting")) {
    manager.setData(entity, "sl:dyn/clap_animation_cooldown", true);
  }

  if (entity.getData("fiskheroes:beam_charge") === 0) {
    manager.setData(entity, "sl:dyn/clap_animation_cooldown", false);
  }

  boostutils.flightSL(entity, manager);

  if (entity.getData("sl:dyn/absorb")) {
    manager.setData(entity, "fiskheroes:energy_charge", 0);
  }

  if (!entity.getData("sl:dyn/absorb")) {
    manager.setData(entity, "sl:dyn/sboost2", false);
  }

  manager.setData(
    entity,
    "fiskheroes:energy_charging",
    entity.posY() > 1028 &&
      (dim === 0 || dim === 2595) &&
      !entity.isSprinting() &&
      !entity.getData("sl:dyn/absorb") &&
      !entity.getData("sl:dyn/suitup") &&
      entity.getData("sl:dyn/absorb_cooldown") == 0 &&
      entity.getData("fiskheroes:prev_flight_timer") > 0.9
  );

  if (
    entity.getData("fiskheroes:energy_charging") &&
    entity.posY() > 1028 &&
    (dim === 0 || dim === 2595) &&
    !entity.isSprinting() &&
    entity.getData("sl:dyn/absorb_cooldown") == 0 &&
    !entity.getData("sl:dyn/absorb") &&
    !entity.getData("sl:dyn/suitup") &&
    entity.getData("fiskheroes:prev_flight_timer") > 0.9
  ) {
    manager.setData(entity, "sl:dyn/sun", true);
  } else {
    manager.setData(entity, "sl:dyn/sun", false);
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

  if (entity.isOnGround() && !entity.isSneaking() && !entity.getData("sl:dyn/absorb")) {
    manager.setData(entity, "sl:dyn/abilities_cycle", 1);
  } else if (entity.getData("sl:dyn/absorb")) {
    manager.setData(entity, "sl:dyn/abilities_cycle", 2);
  } else {
    manager.setData(entity, "sl:dyn/abilities_cycle", 1);
  }
});
}

function isModifierEnabled(entity, modifier) {
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var b = entity.getData("sl:dyn/blue_kryptonite");
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var coldbreath1 = (breathlevel <= -0.25 && breathlevel > -0.5);
    var coldbreath2 = (breathlevel <= -0.5 && breathlevel > -0.75);
    var coldbreath3 = (breathlevel <= -0.75);
    var superbreath1 = (breathlevel >= 0.25 && breathlevel < 0.5);
    var superbreath2 = (breathlevel >= 0.5 && breathlevel < 0.75);
    var superbreath3 = (breathlevel >= 0.75);
    var es_charge = entity.getData("sl:dyn/es_charge");

  switch (modifier.name()) {
        case "fiskheroes:ground_smash":
            switch (modifier.id()) {
                case "gs1":
                    return es_charge > 0.25 && es_charge < 0.5;
                case "gs2":
                    return es_charge > 0.5 && es_charge < 0.75;
                case "gs3":
                    return es_charge > 0.75 && es_charge < 1;
                case "gs4":
                    return es_charge >= 1;
                default:
                    break;
            }
            break;
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
        case "fiskheroes:damage_immunity":
            return entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
        case "fiskheroes:projectile_immunity":
            return entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
    case "fiskheroes:speed_disintegration":
      return false;
    case "fiskheroes:super_speed":
      return !entity.getData("fiskheroes:flying");
    case "fiskheroes:heat_vision":
      switch (modifier.id()) {
        case "heatvision":
          return !entity.getData("sl:dyn/absorb");
        case "solarflare":
          return entity.getData("sl:dyn/absorb");
        default:
          break;
      }
      break;
        case "fiskheroes:energy_projection":
            switch (modifier.id()) {
                case "base":
                    return !entity.getData("sl:dyn/absorb") && !(breathlevel <= -0.25 || breathlevel >= 0.25);
                case "coldbreath_1":
                    return !entity.getData("sl:dyn/absorb") && breathlevel <= -0.25 && breathlevel > -0.5;
                case "coldbreath_2":
                    return !entity.getData("sl:dyn/absorb") && breathlevel <= -0.5 && breathlevel > -0.75;
                case "coldbreath_3":
                    return !entity.getData("sl:dyn/absorb") && breathlevel <= -0.75;
                case "superbreath_1":
                    return !entity.getData("sl:dyn/absorb") && breathlevel >= 0.25 && breathlevel < 0.5;
                case "superbreath_2":
                    return !entity.getData("sl:dyn/absorb") && breathlevel >= 0.5 && breathlevel < 0.75;
                case "superbreath_3":
                    return !entity.getData("sl:dyn/absorb") && breathlevel >= 0.75;
                case "coldbreath_1_supercharged":
                    return entity.getData("sl:dyn/absorb") && breathlevel <= -0.25 && breathlevel > -0.5;
                case "coldbreath_2_supercharged":
                    return entity.getData("sl:dyn/absorb") && breathlevel <= -0.5 && breathlevel > -0.75;
                case "coldbreath_3_supercharged":
                    return entity.getData("sl:dyn/absorb") && breathlevel <= -0.75;
                case "superbreath_1_supercharged":
                    return entity.getData("sl:dyn/absorb") && breathlevel >= 0.25 && breathlevel < 0.5;
                case "superbreath_2_supercharged":
                    return entity.getData("sl:dyn/absorb") && breathlevel >= 0.5 && breathlevel < 0.75;
                case "superbreath_3_supercharged":
                    return entity.getData("sl:dyn/absorb") && breathlevel >= 0.75;
                default:
                    break;
            }
            break;
    case "fiskheroes:controlled_flight":
      switch (modifier.id()) {
        case "normal":
          return (
            !entity.getData("sl:dyn/absorb") && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.55
          );
        case "normalboosted":
          return entity.getData("sl:dyn/sboost") && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.55;
        case "superchargedboosted":
          return entity.getData("sl:dyn/sboost2");
        case "supercharged":
          return entity.getData("sl:dyn/absorb") && !entity.getData("sl:dyn/sboost2");
        case "sick":
          return entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.55;
        default:
          break;
      }
      break;
    case "fiskheroes:charged_beam":
      switch (modifier.id()) {
        case "thunderclap":
          return !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/abilities_cycle") == 1;
        case "solarblast":
          return entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/abilities_cycle") == 2;
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
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var es_charge = entity.getData("sl:dyn/es_charge")
    switch (keyBind) {
        case "HEAT_VISION":
            if (!entity.getData("fiskheroes:mask_open")) {
                return entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aimed_timer") >= 1 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/sboost2");
            } else {
                return entity.getData("fiskheroes:mask_open_timer2") == 1 && !entity.getData("fiskheroes:beam_shooting");
            }

case "HV_CHARGE":
    if (entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:mask_open") || entity.getData("fiskheroes:mask_open") || entity.getData("fiskheroes:energy_projection") || entity.getData("sl:dyn/sboost")) {
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

        case "0":
            return es_charge < 0.25 && entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:mask_open");

        case "51":
            return es_charge >= 0.25 && es_charge < 0.5 && !entity.getData("fiskheroes:mask_open");

        case "50":
            return es_charge >= 0.5 && es_charge < 0.75 && !entity.getData("fiskheroes:mask_open");

        case "75":
            return es_charge >= 0.75 && es_charge < 1 && !entity.getData("fiskheroes:mask_open");

        case "100":
            return es_charge >= 1 && !entity.getData("fiskheroes:mask_open");

        case "GROUND_SMASH":
            return es_charge >= 0.25 && !entity.getData("fiskheroes:mask_open");

        case "SUPER_SPEED":
            return !entity.getData("fiskheroes:flight_boost_timer") > 0;

        case "REMOVEPUNCH":
            return entity.getData("fiskheroes:beam_charging");

        case "ENERGY_PROJECTION":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost");

        case "ABSORB":
      if (entity.as("PLAYER").isCreativeMode()) {
        return !entity.getData("sl:dyn/absorb") && !entity.isSneaking() && entity.getData("flight_boost_timer") > 0 && entity.getData("sl:dyn/absorb_cooldown") == 0 || entity.getData("fiskheroes:energy_charge") === 1.0;
      } else {
        return entity.getData("fiskheroes:energy_charge") === 1.0;
      }

        case "suitup":
            return !entity.getData("sl:dyn/absorb") && entity.isSneaking() && entity.getData("fiskheroes:energy_charge") == 0;

        case "CHARGED_BEAM":
            if (!entity.getData("sl:dyn/absorb")) {
                return entity.getData("flight_boost_timer") === 0 && !entity.isSneaking() && entity.getData("fiskheroes:energy_charge") == 0;
            } else {
                return !entity.getData("sl:dyn/sboost2") && !entity.getData("fiskheroes:mask_open");
            }

        case "VTHUNDERCLAP":
                return entity.getData("flight_boost_timer") === 0 && !entity.isSneaking() && !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/abilities_cycle") == 1 && entity.getData("fiskheroes:energy_charge") == 0;

        case "THESOLARFLARE":
                return entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/abilities_cycle") == 2;

        case "boost":
            return entity.getData("fiskheroes:flight_boost_timer") == 1 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/absorb");

        case "boost2":
            return entity.getData("fiskheroes:flight_boost_timer") == 1 && !entity.getData("sl:dyn/sboost2") && entity.getData("sl:dyn/absorb");

        default:
            return true;
    }
}

function getProfile(entity) {
  if (entity.getData("fiskheroes:energy_projection")) {
    return "EPROJECTPROFILE";
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
  } else if (entity.getData("sl:dyn/suitup") && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.2) {
    return "suitup";
  } else if (entity.getData("sl:dyn/soft_landing_timer") > 0) {
    return "LANDPROFILE";
  } else if (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.2) {
    return "kryptonitesickness";
  }
  return null;
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

function absorbProfile(profile) {
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
            return true;
        default:
            return false;
    }
}
