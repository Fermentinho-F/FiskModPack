var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Doctor Fate Blue Lantern");
    hero.setTier(10);

    hero.setChestplate("Helmet");

    hero.addPowers("emo:lord_of_hope", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 16.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("SPRINT_SPEED", 1.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 3.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8000.0, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Cosmic Beam and Telekinesis", 1);
    hero.addKeyBind("TELEKINESIS", "telekinesis", 1);
    hero.addKeyBind("TELEPORT", "teleport", 2);
    hero.addKeyBind("INVISIBILITY", "invisibility and intangibility", 3);
    hero.addKeyBind("INTANGIBILITY", "intangibility and invisibility", 3);
    hero.addKeyBind("SPELL_MENU", "key.spellMenu", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "Transform", 5);

    hero.setDefaultScale(1.2);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.addSoundEvent("AIM_START", ["fiskheroes:mk50_cannon_aim", "fiskheroes:mk50_cannon_static"]);
    hero.addSoundEvent("AIM_STOP", "fiskheroes:mk50_cannon_retract");
    
    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? entity.getData("fiskheroes:shield_blocking") ? 7 : 8 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 16.5, 0);
    profile.addAttribute("JUMP_HEIGHT", 3.5, 0);
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
        default:
            return true;
    }
    return modifier.name() != "fiskheroes:arrow_catching" && modifier.name() != "fiskheroes:energy_projection" && modifier.name() != "fiskheroes:teleportation" || !entity.getData("fiskheroes:telekinesis");
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
        default:
            return true;
    }
    return keyBind != "ENERGY_PROJECTION" && keyBind != "TELEPORT" || !entity.getData("fiskheroes:telekinesis");
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return entity.getData("fiskheroes:dyn/nanite_timer") == 1;
        case "BREATHE_SPACE":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("fiskheroes:dyn/nanites");
        default:
            return false;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:dyn/nanites") && !entity.getData("fiskheroes:shield");
}
