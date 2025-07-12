var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Titan Shifter Serum");
    hero.setVersion("Jaw");
    hero.setTier(7);
    
    hero.setChestplate("Syringe");
    
    hero.addPowers("moopack:shifting_serum_jaw");
    //hero.addAttribute("PUNCH_DAMAGE", -1.0, 0);
    
    hero.addKeyBind("WEB_ZIP", "Jaw Leap", 1);
    hero.addKeyBind("TITAN", "Shift", 5);

    hero.addSoundEvent("STEP", "moopack:titan_footstep");

    hero.setDefaultScale(defaultScale);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setTierOverride(getTierOverride);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("TITAN", titanProfile);
    /*hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        var titan_timer = entity.getData("moopack:dyn/titan_timer");
        var onground = entity.isOnGround();
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        if (!onground && titan_timer < 1 && titan_timer > 0){
            manager.setData(entity, "fiskheroes:flying", true);
        }
    }); */
}

function defaultScale(entity) {
    if (entity.getData('moopack:dyn/titan')) {
        return 2.5;
    }
    return 1.0;
}

function titanProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 16.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.25, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    profile.addAttribute("WEAPON_DAMAGE", -0.75, 1);
    profile.addAttribute("IMPACT_DAMAGE", 15.0, 0);
    profile.addAttribute("MAX_HEALTH", 10.5, 0);
    //profile.addAttribute("BASE_SPEED", -0.05, 0);
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function getProfile(entity) {
    if (entity.getData("moopack:dyn/titan")) {
        return "TITAN";
    }
}

function getTierOverride(entity) {
    return entity.getData("moopack:dyn/titan") ? 7 : 0;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "WEB_ZIP":
        return entity.getData("moopack:dyn/titan");
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:fire_immunity") {
        return (entity.getData("moopack:dyn/titan"));
    }
    else if (modifier.name() == "fiskheroes:projectile_immunity") {
        return (entity.getData("moopack:dyn/titan"));
    }
    else if (modifier.name() == "fiskheroes:arrow_catching") {
        return (entity.getData("moopack:dyn/titan"));
    }
    else if (modifier.name() == "fiskheroes:leaping") {
        return (entity.getData("moopack:dyn/titan"));
    }
    return true;
}

