function init(hero) {
    hero.setName("Freya Mikaelson");
    hero.setTier(3);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("emo:witch");
    hero.addAttribute("JUMP_HEIGHT", 4.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 9.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);

    hero.addKeyBind("TELEKINESIS", "Sanctuary (telekinesis magic)", 1);
    hero.addKeyBind("AIM", "Incendia (fire magic)", 2);
    hero.addKeyBind("SHIELD", "Shield Spell", 3);
    hero.addKeyBind("INVISIBILITY", "Invivique (invisible magic)", 4);
    hero.addKeyBind("SPELL_MENU", "Spell Menu", 5);

    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 4.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}


function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}