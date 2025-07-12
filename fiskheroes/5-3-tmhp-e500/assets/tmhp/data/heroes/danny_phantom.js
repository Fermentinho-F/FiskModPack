var utils = implement("fiskheroes:external/utils");
var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Danny Phantom/\u00A7c\u00A7lAP 7");
    hero.setTier(5);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("tmhp:ghost_powers");

    hero.addKeyBind("CHARGED_BEAM", "Ghost Ray", 1);
    hero.addKeyBind("CHARGE_ICE", "key.chargeIce", 2);
    hero.addKeyBind("SONIC_WAVES", "Ghostly Wail", 3);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 4);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 4);
    hero.addKeyBind("GHOSTFORM", "GhostForm", 5);

    hero.addAttribute("FALL_RESISTANCE", 3.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("TIRED", tiredProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDefaultScale(0.87);
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
    return entity.getData("tmhp:dyn/ghostform") ? 5 : 0;
}
function inactiveProfile(profile) {
    profile.revokeAugments();
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
    case "INVISIBILITY":
        return entity.isSneaking();
    case "INTANGIBILITY":
        return !entity.isSneaking();
    case "SONIC_WAVES":
        return !entity.getData("fiskheroes:flying") && !entity.getData("tmhp:dyn/ghostly_wail") || entity.getData("fiskheroes:sonic_waves");
    default:
        return true;
    }
}
