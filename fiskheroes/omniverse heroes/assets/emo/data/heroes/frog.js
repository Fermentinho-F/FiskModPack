function init(hero) {
    hero.setName("Frog Thor");
    hero.setTier(8);

    hero.setChestplate("Suit");

    hero.addPowers("emo:god_of_thunder");
    hero.addAttribute("FALL_RESISTANCE", 100, 1);
    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 1.5, 1);
    hero.addAttribute("STEP_HEIGHT", 0.6, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.6, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("CHARGED_BEAM", "Thunder Blast", 1);
    hero.addKeyBind("SUPER_SPEED", "Speed", 2);
    hero.addKeyBind("SLOW_MOTION", "Slow Vision", 3);
    hero.addKeyBind("TELEPORT", "Go to the Moon(You need to look to the moon)", 4);
    hero.addKeyBind("SHIELD", "Mjolnir", 5);

    hero.setDefaultScale(0.5);
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
    profile.addAttribute("PUNCH_DAMAGE", 35.0, 0);
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
        case "SUPER_SPEED":
            return entity.getData("fiskheroes:shield");
        case "SLOW_MOTION":
            return entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
