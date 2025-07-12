function init(hero) {
    hero.setName("Randy Cunningham/\u00A7c\u00A7lAP 5");
    hero.setVersion("9th Grade Ninja Randy Cunningham");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    
    hero.addPowers("tmhp:ninjanomicon");
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);

    hero.addKeyBind("UTILITY_BELT", "Equipments", 1);
    hero.addKeyBind("AIM", "key.shoot", 1);

    hero.addKeyBind("TELEPORT", "key.teleport", 2);
    hero.addKeyBind("FLAME_MOD", "Ninja Flame Mod", 4);

    hero.addKeyBind("SHIELD", "Ninja Sword", 3);
    hero.addKeyBind("BLADE", "Ninja Chain Sickle", 3);

    hero.addKeyBind("WEB_ZIP", "Throw Chain Sickle", 2);

    hero.addKeyBind("NINJA_TRANSFORM", "Ninja Transform", 5);

    hero.supplyFunction("canAim", canAim);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("FLAME", flameProfile);
    hero.addAttributeProfile("FLAMESHIELD", flameshieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("FLAME", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 0.4
        },
        "properties": {
            "HEAT_TRANSFER": 40,
            "IGNITE": 2
        }
    });
    hero.addDamageProfile("FLAMESHIELD", {
        "types": {
            "SHARP": 1.0,
            "FIRE": 0.4
        },
        "properties": {
            "HEAT_TRANSFER": 40,
            "IGNITE": 2
        }
    });
    hero.addDamageProfile("SHIELD", {
        "types": {
            "SHARP": 1.0
        }
    });
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0
        }
    });
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying")) {
            manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
        }
        manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);
    });
}

function getDamageProfile(entity) {
    if (!entity.getData("tmhp:dyn/flame_mod") && entity.getData("fiskheroes:shield")) {
        return "SHIELD";
    }
    else if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    else if (entity.getData("tmhp:dyn/flame_mod") && !entity.getData("fiskheroes:shield")) {
        return "FLAME";
    }
    else if (entity.getData("tmhp:dyn/flame_mod") && entity.getData("fiskheroes:shield")) {
        return "FLAMESHIELD";
    }
    return null;
}
function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("tmhp:dyn/ninja") && entity.getData("tmhp:dyn/ninja_timer") < 1)) {
        return false;
    }
  
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
    case "fiskheroes:web_zip":
        return entity.getData("fiskheroes:blade");
    case "fiskheroes:fireball":
        return entity.getData("tmhp:dyn/flame_mod");
    case "fiskheroes:shield":
        return !entity.getData("fiskheroes:blade");
    case "fiskheroes:arrow_catching":
        return !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:blade") && !entity.getData("tmhp:dyn/flame_mod");
    case "fiskheroes:blade":
        return !entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/flame_mod");
    case "fiskheroes:equipment":
        return !entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/flame_mod");
    default:
        return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/ninja") ? 6 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.2, 1);
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
}
function flameshieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 8.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 4.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
}
function flameProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 8.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 4.0, 0);
    profile.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
}


function getProfile(entity) {
    if (!entity.getData("tmhp:dyn/ninja")) {
        return "INACTIVE";
    }
    else if (!entity.getData("tmhp:dyn/flame_mod") && entity.getData("fiskheroes:shield")) {
        return "SHIELD";
    }
    else if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    else if (entity.getData("tmhp:dyn/flame_mod") && !entity.getData("fiskheroes:shield")) {
        return "FLAME";
    }
    else if (entity.getData("tmhp:dyn/flame_mod") && entity.getData("fiskheroes:shield")) {
        return "FLAMESHIELD";
    }
    return null;
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "NINJA_TRANSFORM") {
        return !entity.getData("tmhp:dyn/flame_mod");
    }
    else if (!entity.getData("tmhp:dyn/ninja")) {
        return false;
    }
    
    switch (keyBind) {
    case "SHIELD":
        return !entity.getData("fiskheroes:blade") && !entity.isSneaking() || entity.getData("fiskheroes:shield");
    case "BLADE":
        return !entity.getData("fiskheroes:shield") && entity.isSneaking() && !entity.getData("tmhp:dyn/flame_mod") || entity.getData("fiskheroes:blade");
    case "AIM":
        return entity.getData("tmhp:dyn/flame_mod");
    case "TELEPORT":
        return entity.getData("tmhp:dyn/ninja") && !entity.getData("fiskheroes:blade");
    case "WEB_ZIP":
        return entity.getData("fiskheroes:blade");
    case "FLAME_MOD":
        return !entity.getData("fiskheroes:blade");
    case "UTILITY_BELT":
        return entity.getData("tmhp:dyn/ninja") && !entity.getData("tmhp:dyn/flame_mod");
    default:
        return true;
    }
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/flame_mod") && !entity.getData("fiskheroes:shield");
}