function init(hero) {
    hero.setName("Blue Beetle");
    hero.setVersion("item.superhero_armor.version.dceu");
    hero.setTier(8);
    
    hero.setChestplate("Scarab");
    hero.setAliases("beetle");

    hero.addPowers("jmctheroes:blue_beetle_scarab_dceu");
    hero.addAttribute("FALL_RESISTANCE", 0.3, 1);
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.85, 0);
    hero.addAttribute("SPRINT_SPEED", 0.40, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);

    hero.addKeyBind("CHARGED_BEAM", "Energy Beam", 1);
    hero.addKeyBind("SHIELD", "Reach Shield", 2);
    hero.addKeyBind("BLADE", "Reach Blade", 2);
    hero.addKeyBind("BEETLE", "Toggle Scarab", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setTierOverride(getTierOverride);
    hero.setHasProperty(hasProperty);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        }
    });

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.getData("fiskheroes:beam_charging") && !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:blade_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());
    });
}

function getTierOverride(entity) {
    return entity.getData("jmctheroes:dyn/beetle") ? 8 : 0;
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.55, 1);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.9, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.4, 1);
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function getProfile(entity) {
    if (!entity.getData("jmctheroes:dyn/beetle")) {
        return "INACTIVE";
    }
    else if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    else if (entity.getData("fiskheroes:shield")) {
        return "SHIELD";
    }
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("jmctheroes:dyn/beetle"))) {
        return false;
    }
  
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:flying") && !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
    case "fiskheroes:shield":
        return entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:flying") && !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
    case "fiskheroes:charged_beam":
        return entity.getHeldItem().isEmpty() && entity.getData("jmctheroes:dyn/beetle");
    case "fiskheroes:controlled_flight":
        return entity.getData("jmctheroes:dyn/beetle");
    case "fiskheroes:hover":
        return entity.getData("jmctheroes:dyn/beetle");
    case "fiskheroes:water_breathing":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("jmctheroes:dyn/beetle");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "BEETLE") {
        return entity.getData("fiskheroes:mask_open_timer") == 0;
    }
    else if (!entity.getData("jmctheroes:dyn/beetle")) {
        return false;
    }
    else if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    
    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:beam_charge");
    case "SHIELD":
        return !entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:blade_timer") == 0 || entity.isBookPlayer();
    case "BLADE":
        return !entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:shield_timer") > 0 || entity.getData("fiskheroes:blade_timer") > 0 || entity.isBookPlayer();
    case "CHARGED_BEAM":
        return entity.getHeldItem().isEmpty() && entity.getData("jmctheroes:dyn/beetle") && !entity.getData("fiskheroes:aiming");
    case "HOVER":
        return entity.getData("jmctheroes:dyn/beetle");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.getData("jmctheroes:dyn/beetle_timer") == 1;
    case "BREATHE_SPACE":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("jmctheroes:dyn/beetle");
    case "BREATHE_UNDERWATER":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("jmctheroes:dyn/beetle");
    default:
        return false;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:blade");
}