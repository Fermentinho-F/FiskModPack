function init(hero) {
    hero.setName("Moon Knight");
    hero.setVersion("Comics");
    hero.setAliases("moon");
    hero.setTier(6);
    
    hero.setHelmet("Hood");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);

    hero.addPowers("jmctheroes:moonsuit");
    hero.addAttribute("PUNCH_DAMAGE", 7.2, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);

    hero.addKeyBind("BLADE", "Toggle Crescent Darts", 1);
    hero.addKeyBind("SHIELD", "Toggle Truncheon", 1);

    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("NIGHT", nightProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission(hasPermission);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
    case "fiskheroes:shield":
        return !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getData("fiskheroes:blade_timer") == 0 || entity.isBookPlayer();
    case "BLADE":
        return entity.getData("fiskheroes:shield_timer") > 0 || entity.getData("fiskheroes:blade_timer") > 0 || entity.isBookPlayer();
    default:
        return true;
    }
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.2, 0);
    profile.addAttribute("SPRINT_SPEED", 0.40, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.75, 1);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.8, 0);
    profile.addAttribute("SPRINT_SPEED", 0.40, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.65, 1);
}

function nightProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 100.8, 0);
    profile.addAttribute("SPRINT_SPEED", 0.55, 1);
    profile.addAttribute("IMPACT_DAMAGE", 20.85, 1);
}

function hasPermission(entity, permission) {
    return permission == "USE_GRAPPLING_GUN";
}

function getProfile(entity) {
    if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    else if (entity.getData("fiskheroes:shield")) {
        return "SHIELD";
    }
    else if (!entity.world(isDaytime())) {
        return "NIGHT";
    }
}