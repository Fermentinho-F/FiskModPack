function init(hero) {
    hero.setName("Kol Mikaelson");
    hero.setTier(3);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("emo:originals");
    hero.addAttribute("JUMP_HEIGHT", 4.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 9.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);

    hero.addKeyBind("VAMPIRE", "Vampire Punch", 1);
    hero.addKeyBind("SUPER_SPEED", "Vampire Speed", 2);
	hero.addKeyBind("SLOW_MOTION", "Slow Vision", 3);


    hero.addAttributeProfile("VAMPIRE", bladeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("VAMPIRE", {
        "types": {
            "SHARP": 1.0,
            "COLD": 0.4
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    profile.addAttribute("KNOCKBACK", 5.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.9, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("emo:dyn/sword_timer") ? "VAMPIRE" : null;
}

function getProfile(entity) {
    return entity.getData("emo:dyn/sword_timer") ? "VAMPIRE" : null;
}
