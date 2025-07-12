var landing = implement("sl:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var utils = implement("fiskheroes:external/utils");
var boostutils = implement("sl:external/boost_utils");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");
var kutils = implement("sl:external/kryptonian_utils");

function init(hero) {
    hero.setName("Lana-Rho/\u00A7c\u00A7lAP 7\u00A7r");
    hero.setTier(8);

    hero.setHelmet("item.superhero_armor.piece.hair");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:kryptonite_inhaler}", true, item => item.nbt().getString('WeaponType') === "sl:kryptonite_inhaler");

    hero.addPowers("sl:kryptonite");
    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", -2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);

    hero.addKeyBind("PUNCHBLOCK", "PUNCHBLOCK", -1);
    hero.addKeyBind("INHALER", "Consume Kryptonite Vial(1)", 1);
    hero.addKeyBind("KRYPTONITE", "Consume Kryptonite Vial", 2);
    hero.addKeyBind("HV_CHARGE", "Cold Vision", 1);
    hero.addKeyBind("HEAT_VISION", "Cold Vision", 1);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
    hero.addKeyBind("boost", "Boost", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
    hero.addKeyBind("energy_proj_unavailable", "\u00A7mHeat Breath", 4);
    hero.addKeyBind("HB_CHARGE", "Heat Breath", 4);
    hero.addKeyBind("ENERGY_PROJECTION", "Heat Breath", 4);
    hero.addKeyBind("GRAVITY_MANIPULATION", "Heat Breath", 4);

    hero.setDefaultScale(1.0);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);

    hero.addSoundEvent("PUNCH", ["sl:glassbreak", "sl:kryptoniteinversepunch"]);
    hero.addSoundEvent("AIM_START", "sl:hvcharge");
    hero.addSoundEvent("MASK_OPEN", "sl:hvcharge_conditionless");
    hero.addSoundEvent("MASK_CLOSE", "sl:hv_end_mask");

    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("kryptonitesickness", kryptonitesicknessProfile);
    hero.addAttributeProfile("KRYPTONITE", kryptoniteProfile);
    hero.addAttributeProfile("INHALER_PUNCH", inhalerpunchProfile);
    hero.addAttributeProfile("EPROJECTPROFILE2", eprojectProfile2);
    hero.addAttributeProfile("EPROJECTPROFILE", eprojectProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("KRYPTONITEDP", {
        "types": {
            "BLUNT": 0.4
        }
    });
    hero.addDamageProfile("INHALERDP", {
    "properties": {
        "EFFECTS": [{
            "id": "minecraft:nausea",
            "duration": 50,
            "amplifier": 0
        }]
    },
        "types": {
            "KRYPTONITE": 1.0
        }
    });

hero.setTickHandler((entity, manager) => {
    boostutils.flightSL(entity, manager);
    landing.tick(entity, manager);
    soft_landing.tick(entity, manager);
    moonFly.moonFly(entity, manager);
    speedsprint.tick(entity, manager);
    kutils.oxygenWeakInverse(entity, manager);
    kutils.heatBreath(entity, manager);
    kutils.xkryptoniteWeaknessInhaler(entity, manager);

    var oxygen = entity.getData("sl:dyn/oxygen");
    var dim = entity.world().getDimension();
    var item1 = entity.as("PLAYER").getEquipmentInSlot(1);

if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getByte("Count") !== 1 && entity.getData("sl:dyn/new_item_timer") === 0) {
    manager.setDataWithNotify(entity, "sl:dyn/new_item", true);
}

if (entity.getData("sl:dyn/new_item")) {
    manager.setDataWithNotify(entity, "sl:dyn/new_item_timer", 340);
    manager.setDataWithNotify(entity, "sl:dyn/new_item", false);
}
if (entity.getData("sl:dyn/new_item_timer") > 0) {
    var nitimer = entity.getData("sl:dyn/new_item_timer");
    nitimer--;

    if (nitimer === 0) {
        var nbt = entity.getWornChestplate().nbt();
        var item = {
            count: 1,
            damage: 0,
            id: 4170,
            json: "WeaponType:sl:kryptonite_inhaler"
        };
        var equipment = manager.newTagList("[{Index:0s,Item:{Count:"+ item.count +", Damage:"+ item.damage +", id:"+ item.id +", tag:{"+ item.json +"}}}]");
        manager.setTagList(nbt, "Equipment", equipment);
        entity.playSound("fiskheroes:modifier.equipment.switch", 1.0, 1.0);
    }
    manager.setDataWithNotify(entity, "sl:dyn/new_item_timer", nitimer);
}


if (entity.getData("sl:dyn/kryptonite_timer") < 1 && (entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:kryptonite_inhaler")) {
    manager.setDataWithNotify(entity, "sl:dyn/kryptonite", false);
}

if (entity.getData("sl:dyn/kryptonite_timer") == 0 && entity.getData("sl:dyn/kryptonite")) {
    manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:used_inhaler");
}

if (entity.getData("sl:dyn/playparticle")) {
    manager.setDataWithNotify(entity, "sl:dyn/playparticle_timer", 7);
    manager.setDataWithNotify(entity, "sl:dyn/playparticle", false);
}

if (entity.getData("sl:dyn/playparticle_timer") > 0) {
    var timer = entity.getData("sl:dyn/playparticle_timer");
    timer--;
    if (timer === 0) {
        manager.setData(entity, "sl:dyn/playparticle", false);
    }
    manager.setDataWithNotify(entity, "sl:dyn/playparticle_timer", timer);
}


    if (entity.getHeldItem().nbt().getString('WeaponType') !== "sl:kryptonite_inhaler") {
        manager.setDataWithNotify(entity, "sl:dyn/inhaler", false);
        manager.setDataWithNotify(entity, "fiskheroes:cryo_charge", 0);
        manager.setBoolean(item1.nbt(), "isCryoChargeSet", false);
    } else {
        if (!item1.nbt().getBoolean("isCryoChargeSet")) {
            manager.setDataWithNotify(entity, "fiskheroes:cryo_charge", 1);
            manager.setBoolean(item1.nbt(), "isCryoChargeSet", true);
        }
    }

    manager.setData(entity, "sl:dyn/kryptonite_on", entity.getData("sl:dyn/kryptonite_timer") == 1);
    if (entity.getData("sl:dyn/kryptonite_cooldown") === 1.0) {
        manager.setDataWithNotify(entity, "sl:dyn/kryptonite", false);
    }

    if (entity.getData("sl:dyn/kryptonite_timer") === 1.0) {
        manager.setData(entity, "sl:dyn/playparticle", false);
    }

    var t = entity.getData("sl:dyn/inhaler_breathe");
    if (entity.getData("sl:dyn/kryptonite_timer") === 0.5) {
        manager.setDataWithNotify(entity, "sl:dyn/inhaler_breathe", t = 25);
    } else if (t > 0) {
        manager.setData(entity, "sl:dyn/inhaler_breathe", --t);
    }
    manager.incrementData(entity, "sl:dyn/inhaler_breathe_timer", 2, 8, t > 0);

    if (entity.getData("fiskheroes:cryo_charge") === 0 && item1.nbt().getBoolean("isCryoChargeSet") && entity.as("PLAYER").getPunchTimer() > 0) {
        manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:broken_inhaler");
        manager.setBoolean(item1.nbt(), "isCryoChargeSet", false);
        manager.setDataWithNotify(entity, "sl:dyn/playparticle", true);
        entity.playSound("sl:main.glassbreak", 1.0, 1.0);
        entity.playSound("sl:main.gas_release", 1.0, 1.0);
    }

    if (entity.getData("fiskheroes:beam_charge") === 0 && entity.getData("fiskheroes:time_since_damaged") > 10.0 && !entity.getData("sl:dyn/hvfloat")) {
        manager.setData(entity, "sl:dyn/hvint", Math.floor(Math.random() < 0.2));
        manager.setData(entity, "sl:dyn/hvfloat", true);
    }
    if (entity.getData("fiskheroes:beam_charge") !== 0 || entity.getData("fiskheroes:time_since_damaged") <= 10.0) {
        manager.setData(entity, "sl:dyn/hvfloat", false);
    }
});
}

function isModifierEnabled(entity, modifier) {
    var activated = entity.getData("sl:dyn/kryptonite_timer") === 1;
    var breathlevel = entity.getData("sl:dyn/heat_breath_level");
    var breathlevel2 = entity.getData("fiskheroes:gravity_amount");
    switch (modifier.name()) {
        case "fiskheroes:regeneration":
            switch (modifier.id()) {
                case "regular":
                    return (!(entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard") || (entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.05 && entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard") && activated);
                case "boosted":
                    return (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard" && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.05 && activated);
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
          return activated && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
        case "fiskheroes:projectile_immunity":
            return activated && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
        case "fiskheroes:water_breathing":
            return activated;
        case "fiskheroes:arrow_catching":
            return activated;
        case "fiskheroes:fire_immunity":
            return activated;
        case "fiskheroes:utility_belt":
            return !entity.getData("sl:dyn/kryptonite");
        case "fiskheroes:damage_resistance":
            switch (modifier.id()) {
                case "kryptoniteresistance":
                    return entity.getData("sl:dyn/kryptonite_timer") === 1;
                case "cold":
                    return entity.getData("sl:dyn/kryptonite_timer") == 1;
                default:
                    break;
            }
        case "fiskheroes:super_speed":
            return entity.getData("sl:dyn/kryptonite_timer") === 1 && !entity.getData("fiskheroes:flying");
        case "fiskheroes:damage_bonus":
            return entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_inhaler";
        case "fiskheroes:leaping":
            return activated;
        case "fiskheroes:controlled_flight":
            switch (modifier.id()) {
                case "normal":
                    return (
                        !entity.getData("sl:dyn/absorb") &&
                        !entity.getData("sl:dyn/sboost") &&
                        !entity.getData("sl:dyn/sboost2") &&
                        activated
                    );
                case "normalboosted":
                    return entity.getData("sl:dyn/sboost") && activated;
                default:
                    break;
            }
        case "fiskheroes:damage_weakness":
            switch (modifier.id()) {
                case "kryptoniteweakness":
                    return entity.getData("sl:dyn/kryptonite_timer") == 1;
                case "redsolar":
                    return entity.getData("sl:dyn/kryptonite_timer") == 1;
                case "sound":
                    return entity.getData("sl:dyn/kryptonite_timer") == 1;
                default:
                    break;
            }
        default:
            return true;
    }
}


function isKeyBindEnabled(entity, keyBind) {
    var breathlevel = entity.getData("sl:dyn/heat_breath_level");
    var breathlevel2 = entity.getData("fiskheroes:gravity_amount");
    switch (keyBind) {
case "HB_CHARGE":
  if (entity.getData("sl:dyn/heat_breath")) {
    if (entity.getData("sl:dyn/oxygen") > 0.8) {
      return !entity.getData("sl:dyn/inverseabsorb") 
		 && entity.getData("sl:dyn/kryptonite_timer") === 1
             && entity.getData("sl:dyn/oxygen") < 1 
             && entity.getData("fiskheroes:energy_projection") 
             && !entity.getData("fiskheroes:beam_charging") 
             && !entity.getData("fiskheroes:heat_vision") 
             && !entity.getData("sl:dyn/sboost") 
             && !(breathlevel >= -0.25 && breathlevel < 0.25) 
             && entity.getData("sl:dyn/heat_breath_level") <= 0;
    } else {
      return !entity.getData("sl:dyn/inverseabsorb") 
		 && entity.getData("sl:dyn/kryptonite_timer") === 1
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
		 && entity.getData("sl:dyn/kryptonite_timer") === 1
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
		 && entity.getData("sl:dyn/kryptonite_timer") === 1
             && entity.getData("sl:dyn/heat_breath_charge") == 0 
             && entity.getData("sl:dyn/oxygen") < 1 
             && !entity.getData("fiskheroes:beam_charging") 
             && !entity.getData("fiskheroes:heat_vision") 
             && !entity.getData("sl:dyn/sboost") 
             && !(breathlevel >= -0.25 && breathlevel < 0.25) 
             && entity.getData("sl:dyn/heat_breath_level") <= 0;
    }
  }
        case "KRYPTONITE":
            return (
                entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_inhaler" &&
                !entity.getData("sl:dyn/kryptonite") &&
                entity.getData("sl:dyn/kryptonite_cooldown") === 0
            );
        case "PUNCHBLOCK":
            return (entity.getData("sl:dyn/inhaler_timer") > 0 && entity.getData("sl:dyn/inhaler_timer") < 1) || entity.getData("sl:dyn/kryptonite_timer") > 0 && entity.getData("sl:dyn/kryptonite_timer") < 1 && entity.getData("sl:dyn/kryptonite");

        case "INHALER":
            return false;

        case "energy_proj_unavailable":
            return (!entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && entity.getData("sl:dyn/oxygen") > 0.8 && entity.getData("sl:dyn/kryptonite_timer") === 1) || entity.getData("sl:dyn/heat_vision")

	case "ENERGY_PROJECTION":
 	 if (entity.getData("sl:dyn/oxygen") > 0.8) {
   	 return entity.getData("sl:dyn/kryptonite_timer") === 1 && entity.getData("sl:dyn/oxygen") < 1 && entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !	entity.getData("sl:dyn/sboost") && (entity.getData("sl:dyn/heat_breath_charge") == 1 || (entity.getData("sl:dyn/heat_breath_level") > 0 && entity.getData("sl:dyn/heat_breath_charge") == 0));
  	} else {
    	return entity.getData("sl:dyn/kryptonite_timer") === 1 && entity.getData("sl:dyn/oxygen") < 1 && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost") && (entity.getData("sl:dyn/heat_breath_charge") == 1 || (entity.getData("sl:dyn/heat_breath_level") > 0 && entity.getData("sl:dyn/heat_breath_charge") == 0));
  	}

	case "GRAVITY_MANIPULATION":
	    if (!entity.getData("sl:dyn/sboost")) {
	        if (entity.getData("sl:dyn/heat_breath")) {
	            if (entity.getData("sl:dyn/heat_breath_level") < 0) {
	                return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/kryptonite_timer") === 1;
	            } else {
	                return !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/kryptonite_timer") === 1;
	            }
	        } else {
	            if (entity.getData("sl:dyn/heat_breath_level") < 0) {
	                return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/kryptonite_timer") === 1;
	            } else {
	                return entity.getData("sl:dyn/heat_breath_charge") <= 0 && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/kryptonite_timer") === 1;
	            }
	        }
	    }

        case "HV_CHARGE":
            return entity.getData("sl:dyn/kryptonite_timer") === 1 && !entity.getData("sl:dyn/sboost") && !entity.getData("fiskheroes:mask_open");

        case "HEAT_VISION":
            if (!entity.getData("fiskheroes:mask_open")) {
                return entity.getData("sl:dyn/heat_vision_charge") === 1;
            } else {
                return entity.getData("sl:dyn/kryptonite_timer") === 1 && !entity.getData("sl:dyn/sboost");
            }
        case "SUPER_SPEED":
            return !entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.getData("sl:dyn/kryptonite_timer") === 1;
        case "SLOW_MOTION":
            return entity.getData("sl:dyn/kryptonite_timer") === 1;
        case "boost":
            return entity.getData("fiskheroes:flight_boost_timer") > 0 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/absorb");
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return entity.getData('fiskheroes:time_since_damaged') > 10.0 && entity.getData("sl:dyn/kryptonite_timer") == 1;
        case "BREATHE_SPACE":
            return entity.getData("sl:dyn/kryptonite_timer") == 1;
        default:
            return false;
    }
}

function getProfile(entity) {
  if (entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/heat_breath_level") > 0) {
    return "EPROJECTPROFILE";
  } else if (entity.getData("fiskheroes:energy_projection") && entity.getData("sl:dyn/heat_breath_level") < 0){
    return "EPROJECTPROFILE2";
  }
    if (entity.getData("sl:dyn/kryptonite")) {
        return null;
    }
    if (entity.getHeldItem().nbt().getString('WeaponType') == "sl:kryptonite_inhaler") {
        return "INHALER_PUNCH";
    }
    if (entity.getData("sl:dyn/kryptonite_sickness_timer") > 0.05 && entity.getData("sl:dyn/xkryptonite_timer") === 1) {
        return "kryptonitesickness";
    }
    return "KRYPTONITE";
}

function kryptonitesicknessProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
    profile.revokeAugments();
}

function kryptoniteProfile(profile) {
    profile.revokeAugments();
}

function inhalerpunchProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 2.0, 0);
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

function getTierOverride(entity) {
  if (!entity.getData("sl:dyn/kryptonite_sickness_timer") > 0.1 && entity.getData("sl:dyn/kryptonite_timer") === 1) {
    return 8;
  }
  
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") > 0.1 && entity.getData("sl:dyn/kryptonite_timer") === 1) {
    return 6;
  }
  
  return 2;
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
function getDamageProfile(entity) {
    if (entity.getHeldItem().nbt().getString('WeaponType') == "sl:kryptonite_inhaler") {
        return "INHALERDP";
    } else if (entity.getData("fiskheroes:cryo_charge") > 0) {
        return "KRYPTONITEDP";
    } else {
        return null;
    }
}