function init(hero) {
    hero.setName("Venom");
    hero.setAliases("space_goo");
    hero.setTier(8);
    
    hero.setChestplate("Symbiote");

    hero.addPowers("jmctheroes:symbiote_physiology");
    hero.addAttribute("FALL_RESISTANCE", 0.7, 1);
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.40, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.75, 1);

    hero.addKeyBind("SIZE_MANIPULATION", "key.sizeManipulation", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SHIELD", "Symbiote Shield", 4);
    hero.addKeyBind("BLADE", "Symbiote Blade", 4);
    hero.addKeyBind("SYMBIOTE", "Mask! Copy!", 5);

    hero.setHasProperty(hasProperty);
    hero.setDefaultScale(defaultScale);
    hero.setAttributeProfile(getProfile);
    hero.setTierOverride(getTierOverride);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addSoundEvent("MASK_OPEN", "jmctheroes:symbiote_mask");
    hero.addSoundEvent("MASK_CLOSE", "jmctheroes:symbiote_mask");
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9.1, 0);
    profile.addAttribute("SPRINT_SPEED", 0.40, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.8, 1);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9.7, 0);
    profile.addAttribute("SPRINT_SPEED", 0.40, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.95, 1);
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function getProfile(entity) {
    if (!entity.getData("jmctheroes:dyn/symbiote")) {
        return "INACTIVE";
    }
    else if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    else if (entity.getData("fiskheroes:shield")) {
        return "SHIELD";
    }
}

function defaultScale(entity) {
    if (entity.getData('jmctheroes:dyn/symbiote_timer')) {
        return 1.25;
    }
    return 1.0;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("jmctheroes:dyn/symbiote"))) {
        return false;
    }
  
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
    case "fiskheroes:shield":
        return !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:water_breathing":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("jmctheroes:dyn/symbiote");
    default:
        return true;
    }
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    
    if (!flag) {
    }
    
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "SYMBIOTE") {
        return entity.getData("fiskheroes:mask_open_timer") == 0;
    }
    else if (!entity.getData("jmctheroes:dyn/symbiote")) {
        return false;
    }
    
    switch (keyBind) {
    case "SHIELD":
        return entity.getData("fiskheroes:blade_timer") == 0 || entity.isBookPlayer();
    case "BLADE":
        return entity.getData("fiskheroes:shield_timer") > 0 || entity.getData("fiskheroes:blade_timer") > 0 || entity.isBookPlayer();
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    case "SYMBIOTE":
        return entity.getData("jmctheroes:dyn/symbiote_timer") == 0 || entity.getData("jmctheroes:dyn/symbiote_timer") == 1;
    default:
        return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("jmctheroes:dyn/symbiote") ? 8 : 0;
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.getData("jmctheroes:dyn/symbiote_timer") == 1;
    case "BREATHE_SPACE":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("jmctheroes:dyn/symbiote");
    default:
        return false;
    }
}
