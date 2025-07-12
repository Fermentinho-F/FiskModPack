var utils = implement("fiskheroes:external/utils");
var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Danny Phantom/\u00A7c\u00A7lAP 8");
    hero.setVersion("5YL");
    hero.setTier(7);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("tmhp:ghost_powers_5yl");

    hero.addKeyBind("ENERGY_PROJECTION", "Ghost Ray", 1);
    hero.addKeyBind("CHARGED_BEAM", "Phantom Flame", 1);
    hero.addKeyBind("BLADE", "Spectre Slicer", 2);
    hero.addKeyBind("SHIELD", "Shield", 2);
    hero.addKeyBind("CHARGE_ICE", "key.chargeIce", 3);
    hero.addKeyBind("SONIC_WAVES", "Ghostly Wail", 3);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 4);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 4);
    hero.addKeyBind("GHOSTFORM", "GhostForm", 5);

    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("TIRED", tiredProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.setHasProperty(hasProperty);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.5
        }
    });
    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
        landing.tick(entity, manager);
        if (!entity.isSneaking() && !entity.isOnGround() && entity.motionY() < -0.8) {
            manager.setData(entity, "fiskheroes:flying", true);
            manager.setData(entity, "tmhp:dyn/ghostform", true);
        }
    });
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/ghostform") ? 7 : 0;
}
function inactiveProfile(profile) {
    profile.revokeAugments();
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
}
function tiredProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("SPRINT_SPEED", 0.01, 1);
    profile.addAttribute("BASE_SPEED", -0.6, 1);
}
function getProfile(entity) {
    if (!entity.getData("tmhp:dyn/ghostform")) {
        return "INACTIVE";
    }
    else if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    else if (entity.getData("tmhp:dyn/ghostly_wail")) {
        return "TIRED";
    }
}
function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("tmhp:dyn/ghostform") && entity.getData("tmhp:dyn/ghostform_timer") < 1)) {
        return false;
    }
    switch (modifier.name()) {
    case "fiskheroes:icicles":
        return entity.getData("fiskheroes:cryo_charge") == 1;
    case "fiskheroes:fire_immunity":
        return entity.getData("fiskheroes:intangible");
    case "fiskheroes:water_breathing":
        return entity.getData("fiskheroes:intangible");
    case "fiskheroes:controlled_flight":
        return !entity.getData("tmhp:dyn/ghostly_wail");
    case "fiskheroes:blade":
        return !entity.getData("tmhp:dyn/ghostly_wail");
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "GHOSTFORM") {
        return entity.getData("fiskheroes:mask_open_timer") == 0;
    }
    else if (!entity.getData("tmhp:dyn/ghostform")) {
        return false;
    }
    
    switch (keyBind) {
    case "CHARGED_BEAM":
        return entity.isSneaking();
    case "ENERGY_PROJECTION":
        return !entity.isSneaking();
    case "SHIELD":
        return !entity.isSneaking() && !entity.getData("fiskheroes:intangibility_timer") && !entity.isSprinting();
    case "BLADE":
        return entity.isSneaking() && !entity.getData("fiskheroes:intangibility_timer");
    case "SONIC_WAVES":
        return entity.isSneaking() && !entity.getData("fiskheroes:flying") && !entity.getData("tmhp:dyn/ghostly_wail") || entity.getData("fiskheroes:sonic_waves");
    case "CHARGE_ICE":
        return !entity.isSneaking();
    case "INVISIBILITY":
        return entity.isSneaking();
    case "INTANGIBILITY":
        return !entity.isSneaking();
    default:
        return true;
    }
}
function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}