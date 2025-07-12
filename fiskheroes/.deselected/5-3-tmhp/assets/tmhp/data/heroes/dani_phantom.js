var utils = implement("fiskheroes:external/utils");
var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Dani Phantom/\u00A7c\u00A7lAP 4");
    hero.setTier(4);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("tmhp:ghost_powers_clone");

    hero.addKeyBind("CHARGED_BEAM", "Ghost Ray", 1);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 3);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 4);
    hero.addKeyBind("GHOSTFORM", "GhostForm", 5);

    hero.addAttribute("FALL_RESISTANCE", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 1.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDefaultScale(0.73);
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
    return entity.getData("tmhp:dyn/ghostform") ? 4 : 0;
}
function inactiveProfile(profile) {
    profile.revokeAugments();
}
function getProfile(entity) {
    if (!entity.getData("tmhp:dyn/ghostform")) {
        return "INACTIVE";
    }
}
function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("tmhp:dyn/ghostform") && entity.getData("tmhp:dyn/ghostform_timer") < 1)) {
        return false;
    }
    switch (modifier.name()) {
    case "fiskheroes:fire_immunity":
        return entity.getData("fiskheroes:intangible");
    case "fiskheroes:water_breathing":
        return entity.getData("fiskheroes:intangible");
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
    case "SONIC_WAVES":
        return entity.isSneaking();
    case "CHARGE_ICE":
        return !entity.isSneaking();
    default:
        return true;
    }
}