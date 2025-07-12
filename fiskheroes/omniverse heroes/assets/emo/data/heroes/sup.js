function init(hero) {
    hero.setName("Superman");
    hero.setTier(9);
    
    hero.setChestplate("glasses");
       
    hero.addPowers("emo:kryptonian", "emo:nanit_transform", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 100, 1);
    hero.addAttribute("MAX_HEALTH", 6.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);
    
    hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
    hero.addKeyBind("CHARGED_BEAM", "freeze breath", 2);
    hero.addKeyBind("SUPER_SPEED", "speed", 3);
	hero.addKeyBind("SLOW_MOTION", "slow time", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "Suit Transform", 5);
	
    hero.setDefaultScale(defaultScale);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? entity.getData("fiskheroes:shield_blocking") ? 7 : 8 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.5, 0);
    profile.addAttribute("JUMP_HEIGHT", 5.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 9000.5, 0);
}

function getProfile(entity) {
    if (!entity.getData("fiskheroes:dyn/nanites")) {
        return "INACTIVE";
    }
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("fiskheroes:dyn/nanites") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("fiskheroes:dyn/nanite_timer") < 1)) {
        return false;
    }
  
    switch (modifier.name()) {
        case "fiskheroes:energy_bolt":
            return entity.getData("fiskheroes:aimed_timer") >= 1;
        case "fiskheroes:blade":
            return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
        case "fiskheroes:regeneration":
            return !entity.getData("fiskheroes:blade");
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:super_speed":
            return entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:slow_motion":
             return entity.getData("fiskheroes:dyn/nanites");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "NANITE_TRANSFORM") {
        return entity.getData("fiskheroes:mask_open_timer") == 0;
    }
    else if (!entity.getData("fiskheroes:dyn/nanites")) {
        return false;
    }
    else if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    
    switch (keyBind) {
        case "SHIELD":
            return entity.isSneaking() || entity.isBookPlayer();
        case "BLADE":
            return !entity.isSneaking() && !entity.getData("fiskheroes:shield");
        case "HEAT_VISION":
                return entity.getData("fiskheroes:dyn/nanites");
        case "CHARGED_BEAM":
            return entity.getData("fiskheroes:dyn/nanites");
        case "SUPER_SPEED":
            return entity.getData("fiskheroes:dyn/nanites");
        case "SLOW_MOTION":
            return entity.getData("fiskheroes:dyn/nanites");
        default:
            return true;
    }
}

function defaultScale(entity) {
    if (entity.getData("fiskheroes:dyn/nanites")) {
        return 1.1;
    }
    return 0.9;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}