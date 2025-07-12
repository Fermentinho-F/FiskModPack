function init(hero) {
    hero.setName("The Power Of Wizards");
    hero.setTier(5);
    
    hero.setChestplate("Wand");
    
    hero.addPowers("emo:asa");
    hero.addAttribute("JUMP_HEIGHT", 2.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 9.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("CHARGED_BEAM", "Hope Blast", 1);
    hero.addKeyBind("TELEPORT", "Teleport", 2);
    hero.addKeyBind("SPELL_MENU", "Spell Menu", 3);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 4);
    hero.addKeyBind("SHIELD", "Wand", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 30.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("fiskheroes:shield");    
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGED_BEAM":
            return entity.getData("fiskheroes:shield");
        case "TELEPORT":
            return entity.getData("fiskheroes:shield");
        case "SPELL_MENU":
            return entity.getData("fiskheroes:shield");
        case "TELEKINESIS":
            return entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
