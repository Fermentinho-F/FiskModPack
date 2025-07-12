function init(hero) {
    hero.setName("Doctor Fate/\u00A7c\u00A7lAP 9");
    hero.setTier(10);
    
    hero.setHelmet("Helmet");
    
    hero.addPowers("tmhp:lord_of_order");
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    
    hero.addKeyBind("CHARGED_BEAM", "Eldricth Blast", 1);
    hero.addKeyBind("AIM", "Cast Flame Spell", 1);
    hero.addKeyBind("SHIELD", "key.forcefield", 2);
    hero.addKeyBind("CHARGE_ENERGY", "Cast Lightning Spell", 2);
    hero.addKeyBind("SPELL_MENU", "Spell Menu", 3);
    hero.addKeyBind("TELEPORT", "Teleport", 4);
    hero.addKeyBind("SUIT", "Active Armor", 5);
    
    hero.supplyFunction("canAim", canAim);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setAttributeProfile(getProfile);
    
}
function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? 10 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function getProfile(entity) {
    return !entity.getData("fiskheroes:dyn/nanites") ? "INACTIVE" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return entity.getData("fiskheroes:dyn/nanites");
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGED_BEAM":
        return !entity.isSneaking() && entity.getData("fiskheroes:dyn/nanites");
    case "AIM":
        return entity.isSneaking() && entity.getData("fiskheroes:dyn/nanites");
    case "SHIELD":
        return !entity.isSneaking() && entity.getData("fiskheroes:dyn/nanites");
    case "CHARGE_ENERGY":
        return entity.isSneaking() && entity.getData("fiskheroes:dyn/nanites");
    case "SPELL_MENU":
        return entity.getData("fiskheroes:dyn/nanites");
    case "TELEPORT":
        return entity.getData("fiskheroes:dyn/nanites");
    case "SUIT":
        return !entity.getData("fiskheroes:flying");
    default:
        return true;
    }
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:dyn/nanites") && !entity.getData("fiskheroes:shield");
}