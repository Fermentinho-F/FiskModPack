var landing = implement("sl:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var utils = implement("fiskheroes:external/utils");
var boostutils = implement("sl:external/boost_utils");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");
var kutils = implement("sl:external/kryptonian_utils");

function init(hero) {
    hero.setName("Lt. Mitchell Anderson/\u00A7c\u00A7lAP 7\u00A7r");
    hero.setTier(8);

    hero.setHelmet("Hat");
    hero.setChestplate("Vest");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:kryptoniterifle}", true, item => item.nbt().getString('WeaponType') === "sl:kryptoniterifle");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:kryptonitepistol}", true, item => item.nbt().getString('WeaponType') === "sl:kryptonitepistol");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:xkryptonite_inhaler}", true, item => item.nbt().getString('WeaponType') === "sl:xkryptonite_inhaler");

    hero.addPowers("sl:xkryptonite", "sl:kryptonite_rifle");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", -1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.25, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);

    hero.addKeyBind("PUNCHBLOCK", "PUNCHBLOCK", -1);
    hero.addKeyBind("INHALER", "Equip X-Kryptonite Vial", 1);
    hero.addKeyBind("KRYPTONITE", "Consume X-Kryptonite Vial", 2);
    hero.addKeyBind("CHARGED_BEAM", "Heat Vision", 1);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
    hero.addKeyBind("boost", "Boost", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
    hero.addKeyBind("energy_proj_unavailable", "\u00A7mCold Breath", 4);
    hero.addKeyBind("ENERGY_PROJECTION", "Cold Breath", 4);
    hero.addKeyBind("GRAVITY_MANIPULATION", "Cold Breath", 4);
    hero.addKeyBind("ENERGY_PROJECTION", "Cold Breath", 4);

    hero.addKeyBind("AIM", "key.aim", -1);

    hero.setDefaultScale(1.0);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission((entity, permission) => permission === "USE_KRYPTONITE_GUN");
    hero.setTierOverride(getTierOverride);

    hero.addSoundEvent("PUNCH", ["sl:glassbreak", "sl:xkryptonitepunch"]);
    hero.addSoundEvent("MASK_OPEN", "sl:hvcharge_conditionless");
    hero.addSoundEvent("MASK_CLOSE", "sl:hv_end_mask");

    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("EPROJECTPROFILE", eprojectProfile);
    hero.addAttributeProfile("kryptonitesickness", kryptonitesicknessProfile);
    hero.addAttributeProfile("KRYPTONITE", kryptoniteProfile);
    hero.addAttributeProfile("INHALER_PUNCH", inhalerpunchProfile);
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
            "id": "minecraft:saturation",
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
    kutils.oxygenWeak(entity, manager);
    kutils.kryptoniteWeaknessInhaler(entity, manager);

    var oxygen = entity.getData("sl:dyn/oxygen");
    var dim = entity.world().getDimension();
    var item1 = entity.as("PLAYER").getEquipmentInSlot(1);

if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("2").getCompoundTag("Item").getByte("Count") !== 1 && entity.getData("sl:dyn/new_item_timer") === 0) {
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
        var equipment = nbt.getTagList("Equipment");

        var newItem = manager.newCompoundTag("{Item:{id:4170s,Count:1b,Damage:0s,tag:{WeaponType:\"sl:xkryptonite_inhaler\"}},Index:2b}");

        var foundSlot = false;
        for (var i = 0; i < equipment.tagCount(); i++) {
            var slot = equipment.getCompoundTag(i);
            if (slot.getByte("Index") === 2) {
                manager.setCompoundTag(slot, "Item", newItem.getCompoundTag("Item"));
                foundSlot = true;
                break;
            }
        }

        if (!foundSlot) {
            manager.appendTag(equipment, newItem);
        }

        manager.setTagList(nbt, "Equipment", equipment);
        entity.playSound("fiskheroes:modifier.equipment.switch", 1.0, 1.0);
    }

    manager.setDataWithNotify(entity, "sl:dyn/new_item_timer", nitimer);
}


if (entity.getData("sl:dyn/xkryptonite_timer") < 1 && (entity.getHeldItem().nbt().getString('WeaponType') !== "sl:used_inhaler" && entity.getHeldItem().nbt().getString('WeaponType') !== "sl:xkryptonite_inhaler")) {
    manager.setDataWithNotify(entity, "sl:dyn/xkryptonite", false);
}

if (entity.getData("sl:dyn/xkryptonite_timer") == 0 && entity.getData("sl:dyn/xkryptonite")) {
    manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:used_inhaler");
}

if (entity.getData("sl:dyn/playparticle")) {
    manager.setData(entity, "sl:dyn/playparticle_timer", 7);
    manager.setData(entity, "sl:dyn/playparticle", false);
}

if (entity.getData("sl:dyn/playparticle_timer") > 0) {
    var timer = entity.getData("sl:dyn/playparticle_timer");
    timer--;
    if (timer === 0) {
        manager.setData(entity, "sl:dyn/playparticle", false);
    }
    manager.setData(entity, "sl:dyn/playparticle_timer", timer);
}


    if (entity.getHeldItem().nbt().getString('WeaponType') !== "sl:xkryptonite_inhaler") {
        manager.setDataWithNotify(entity, "sl:dyn/inhaler", false);
        manager.setDataWithNotify(entity, "fiskheroes:cryo_charge", 0);
        manager.setBoolean(item1.nbt(), "isCryoChargeSet", false);
    } else {
        if (!item1.nbt().getBoolean("isCryoChargeSet")) {
            manager.setDataWithNotify(entity, "fiskheroes:cryo_charge", 1);
            manager.setBoolean(item1.nbt(), "isCryoChargeSet", true);
        }
    }

    manager.setData(entity, "sl:dyn/kryptonite_on", entity.getData("sl:dyn/xkryptonite_timer") == 1);
    if (entity.getData("sl:dyn/xkryptonite_cooldown") === 1.0) {
        manager.setDataWithNotify(entity, "sl:dyn/xkryptonite", false);
    }

    if (entity.getData("sl:dyn/xkryptonite_timer") === 1.0) {
        manager.setData(entity, "sl:dyn/playparticle", false);
    }

    var t = entity.getData("sl:dyn/inhaler_breathe");
    if (entity.getData("sl:dyn/xkryptonite_timer") === 0.5) {
        manager.setDataWithNotify(entity, "sl:dyn/inhaler_breathe", t = 25);
    } else if (t > 0) {
        manager.setData(entity, "sl:dyn/inhaler_breathe", --t);
    }
    manager.incrementData(entity, "sl:dyn/inhaler_breathe_timer", 2, 8, t > 0);

    if (entity.getData("fiskheroes:cryo_charge") === 0 && item1.nbt().getBoolean("isCryoChargeSet") && entity.as("PLAYER").getPunchTimer() > 0) {
        manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:broken_inhaler");
        manager.setBoolean(item1.nbt(), "isCryoChargeSet", false);
        manager.setData(entity, "sl:dyn/playparticle", true);
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
    var b = entity.getData("sl:dyn/blue_kryptonite");
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    var coldbreath1 = (breathlevel <= -0.25 && breathlevel > -0.5);
    var coldbreath2 = (breathlevel <= -0.5 && breathlevel > -0.75);
    var coldbreath3 = (breathlevel <= -0.75);
    var superbreath1 = (breathlevel >= 0.25 && breathlevel < 0.5);
    var superbreath2 = (breathlevel >= 0.5 && breathlevel < 0.75);
    var superbreath3 = (breathlevel >= 0.75);
    var activated = entity.getData("sl:dyn/xkryptonite_timer") === 1;
    switch (modifier.name()) {
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
        case "fiskheroes:damage_immunity":
          return activated && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
        case "fiskheroes:projectile_immunity":
            return activated && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.3;
        case "fiskheroes:water_breathing":
            return activated;
        case "fiskheroes:arrow_catching":
        case "fiskheroes:fire_immunity":
            return activated;
        case "fiskheroes:utility_belt":
            return !entity.getData("sl:dyn/xkryptonite");
        case "fiskheroes:damage_resistance":
            switch (modifier.id()) {
                case "xkryptoniteresistance":
                    return entity.getData("sl:dyn/xkryptonite_timer") == 1;
                case "cold":
                    return entity.getData("sl:dyn/xkryptonite_timer") == 1;
                default:
                    break;
            }
        case "fiskheroes:super_speed":
            return entity.getData("sl:dyn/xkryptonite_timer") === 1 && !entity.getData("fiskheroes:flying");
        case "fiskheroes:leaping":
            return activated;
        case "fiskheroes:damage_bonus":
            return entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_inhaler";
        case "fiskheroes:controlled_flight":
            switch (modifier.id()) {
                case "normal":
                    return (
                        !entity.getData("sl:dyn/absorb") &&
                        !entity.getData("sl:dyn/sboost") &&
                        !entity.getData("sl:dyn/sboost2") &&
                        activated &&
				entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.55
                    );
                case "normalboosted":
                    return entity.getData("sl:dyn/sboost") && activated && entity.getData("sl:dyn/kryptonite_sickness_timer") < 0.55;
              case "sick":
         		  return entity.getData("sl:dyn/kryptonite_sickness_timer") >= 0.55;
                default:
                    break;
            }
        case "fiskheroes:repulsor_blast":
            switch (modifier.id()) {
                case "normal":
                    return !entity.isSneaking() && entity.getHeldItem().name() == "fiskheroes:chronos_rifle";
                case "sneaking":
                    return entity.isSneaking() && entity.getHeldItem().name() == "fiskheroes:chronos_rifle";
                default:
                    break;
            }
        case "fiskheroes:charged_beam":
            switch (modifier.id()) {
                case "maskless":
                    return !entity.getData("fiskheroes:mask_open");
                case "mask":
                    return entity.getData("fiskheroes:mask_open");
                case "kryptonite_gauntlets":
                    return false;
                default:
                    break;
            }
        case "fiskheroes:damage_weakness":
            switch (modifier.id()) {
                case "kryptoniteweakness":
                    return entity.getData("sl:dyn/xkryptonite_timer") == 1;
                case "redsolar":
                    return entity.getData("sl:dyn/xkryptonite_timer") == 1;
                case "sound":
                    return entity.getData("sl:dyn/xkryptonite_timer") == 1;
                default:
                    break;
            }
        default:
            return true;
    }
}


function isKeyBindEnabled(entity, keyBind) {
    var b = entity.getData("sl:dyn/blue_kryptonite");
    var breathlevel = entity.getData("fiskheroes:gravity_amount");
    switch (keyBind) {
        case "KRYPTONITE":
            return (
                entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_inhaler" &&
                !entity.getData("sl:dyn/xkryptonite") &&
                entity.getData("sl:dyn/xkryptonite_cooldown") === 0
            );
        case "PUNCHBLOCK":
            return (entity.getData("sl:dyn/inhaler_timer") > 0 && entity.getData("sl:dyn/inhaler_timer") < 1) || entity.getData("sl:dyn/xkryptonite_timer") > 0 && entity.getData("sl:dyn/xkryptonite_timer") < 1;
        case "INHALER":
            return false;
            case "energy_proj_unavailable":
                return !entity.getData("sl:dyn/absorb") && !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && entity.getData("sl:dyn/oxygen") > 0.8;

            case "ENERGY_PROJECTION":
                if (entity.getData("sl:dyn/oxygen") > 0.8) {
                    return !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/oxygen") < 1 && entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost") && !(breathlevel >= -0.25 && breathlevel < 0.25);
                } else {
                    return !entity.getData("sl:dyn/absorb") && entity.getData("sl:dyn/oxygen") < 1 && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("sl:dyn/sboost") && !(breathlevel >= -0.25 && breathlevel < 0.25);
                }

	case "GRAVITY_MANIPULATION":
	    if (!entity.getData("sl:dyn/sboost")) {
	        if (entity.getData("sl:dyn/heat_breath")) {
	            if (entity.getData("sl:dyn/heat_breath_level") < 0) {
	                return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/xkryptonite_timer") === 1;
	            } else {
	                return !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/xkryptonite_timer") === 1;
	            }
	        } else {
	            if (entity.getData("sl:dyn/heat_breath_level") < 0) {
	                return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/xkryptonite_timer") === 1;
	            } else {
	                return entity.getData("sl:dyn/heat_breath_charge") <= 0 && !entity.getData("fiskheroes:heat_vision") && !entity.getData("fiskheroes:beam_charging") && entity.getData("sl:dyn/xkryptonite_timer") === 1;
	            }
	        }
	    }

        case "CHARGED_BEAM":
            return entity.getData("sl:dyn/xkryptonite_timer") === 1 && !entity.getData("sl:dyn/sboost");
        case "AIM":
            return !entity.getData("sl:dyn/inhaler");
        case "HEAT_VISION":
            return entity.getData("fiskheroes:aimed_timer") === 1;
        case "SUPER_SPEED":
            return !entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.getData("sl:dyn/xkryptonite_timer") === 1;
        case "SLOW_MOTION":
            return entity.getData("sl:dyn/xkryptonite_timer") === 1;
        case "boost":
            return entity.getData("fiskheroes:flight_boost_timer") > 0 && !entity.getData("sl:dyn/sboost") && !entity.getData("sl:dyn/absorb");
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return entity.getData('fiskheroes:time_since_damaged') > 10.0 && entity.getData("sl:dyn/xkryptonite_timer") == 1;
        case "BREATHE_SPACE":
            return entity.getData("sl:dyn/xkryptonite_timer") == 1;
        default:
            return false;
    }
}

function getProfile(entity) {
  if (entity.getData("fiskheroes:energy_projection")) {
    return "EPROJECTPROFILE";
  }
    if (entity.getData("sl:dyn/xkryptonite")) {
        return null;
    }
    if (entity.getHeldItem().nbt().getString('WeaponType') == "sl:xkryptonite_inhaler") {
        return "INHALER_PUNCH";
    }
    if (entity.getData("sl:dyn/kryptonite_sickness_timer") > 0.05 && entity.getData("sl:dyn/xkryptonite_timer") === 1) {
        return "kryptonitesickness";
    }
    return "KRYPTONITE";
}

function eprojectProfile(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -0.5, 0);
    profile.addAttribute("SPRINT_SPEED", -0.285, 1);
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

function getTierOverride(entity) {
  if (!entity.getData("sl:dyn/kryptonite_sickness_timer") > 0.1 && entity.getData("sl:dyn/xkryptonite_timer") === 1) {
    return 8;
  }
  
  if (entity.getData("sl:dyn/kryptonite_sickness_timer") > 0.1 && entity.getData("sl:dyn/xkryptonite_timer") === 1) {
    return 6;
  }
  
  return 2;
}

function getDamageProfile(entity) {
    if (entity.getHeldItem().nbt().getString('WeaponType') == "sl:xkryptonite_inhaler") {
        return "INHALERDP";
    } else if (entity.getData("fiskheroes:cryo_charge") > 0) {
        return "KRYPTONITEDP";
    } else {
        return null;
    }
}

function canAim(entity) {
    return entity.getHeldItem().name() === "fiskheroes:chronos_rifle" || 
           (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonitepistol" || 
            entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptoniterifle");
}


