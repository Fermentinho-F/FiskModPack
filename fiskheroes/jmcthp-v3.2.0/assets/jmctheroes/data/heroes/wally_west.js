//Mango's Favourite Suit :P

function init(hero) {
    hero.setName("The Flash/Wally West");
    hero.setAliases("ww");
    hero.setTier(9);
    
    hero.setChestplate("Suit");
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("jmctheroes:enhanced_sf", "jmctheroes:suit");
    hero.addAttribute("BASE_SPEED_LEVELS", 9.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.75, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.55, 0);
    hero.addAttribute("SPRINT_SPEED", 0.85, 1);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("VIBRATE", "Vibrate", 3);
    hero.addKeyBind("SUIT", "Summon Suit", 4);

    // If your seeing this i gotta ask why you need to look in here (Unless your JMCT, Mango or a heropack dev, Leave)?

    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.supplyFunction("canDischargeEnergy", canDischargeEnergy);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("SPEED_PUNCH", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 5
        }
    });
    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") && entity.getData("fiskheroes:speed") > 0.5);
        if (entity.getData("fiskheroes:speed_sprinting") != entity.getData("fiskheroes:energy_charging")) {
            manager.setData(entity, "fiskheroes:energy_charging", entity.getData("fiskheroes:speed_sprinting"));
        }
    });
}

function getProfile(entity) {
    if (!entity.getData("jmctheroes:dyn/suit")) {
        return "INACTIVE";
    }
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function canDischargeEnergy(entity) {
    return entity.getHeldItem().isEmpty();
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : null;
}

function getTierOverride(entity) {
    return entity.getData("jmctheroes:dyn/suit") ? 9 : 0;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:energy_manipulation") {
        return (entity.isSprinting()) && (entity.getData("fiskheroes:speeding"));
    }
    else if (modifier.name() == "jmctheroes:dyn/vibrate") {
        return (entity.getData("fiskheroes:speeding") && entity.getData("jmctheroes:dyn/suit"));
    }
    else if (modifier.name() == "fiskheroes:super_speed") {
        return entity.getData("jmctheroes:dyn/suit");
    }
    else if (modifier.name() == "fiskheroes:slow_motion") {
        return entity.getData("jmctheroes:dyn/suit");
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ENERGY":
        return entity.isSprinting() && entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:speed") >= 4;
    case "VIBRATE":
        return entity.getData("fiskheroes:speeding") && entity.getData("jmctheroes:dyn/suit");
    case "SUPER_SPEED":
        return entity.getData("jmctheroes:dyn/suit");
    case "SLOW_MOTION":
        return entity.getData("jmctheroes:dyn/suit");
    default:
        return true;
    }
}