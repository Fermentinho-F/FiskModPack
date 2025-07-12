function init(hero) {
    hero.setName("Sasuke");
    hero.setTier(7);
    
    hero.setChestplate("Suit");
    hero.addPrimaryEquipment("fiskheroes:katana", true);
    
    hero.addPowers("emo:sasuke");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    
    hero.addKeyBind("CHARGED_BEAM", "katon gouka no jutsu", 1);
    hero.addKeyBind("UTILITY_BELT", "throwing star", 2);
    hero.addKeyBind("BLADE", "chidori", 3);
    
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "COLD": 0.4
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}
