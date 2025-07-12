function init(hero) {
    hero.setName("Professor Paradox");
    hero.setTier(6);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("emo:paradox");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 7.0, 0);
    
    hero.addKeyBind("TELEPORT", "Teleport", 1);
    hero.addKeyBind("SUPER_SPEED", "Speed", 2);
    hero.addKeyBind("SLOW_MOTION", "Time Manipulation", 3);
    hero.addKeyBind("SIZE_MANIPULATION", "Quantum Realm Teleport", 4);

    hero.supplyFunction("isInstant", true);
    hero.setRuleValueModifier(ruleModifier);
    hero.setHasProperty(hasProperty);
}

function ruleModifier(entity, rule) {
    if (rule.name() == "fiskheroes:ticks_qrtimer") {
        return rule.value() * 0.008;
    }
    return null;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}