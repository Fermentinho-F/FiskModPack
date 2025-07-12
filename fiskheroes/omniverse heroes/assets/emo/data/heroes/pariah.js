function init(hero) {
    hero.setName("Pariah (Nash Wells)");
    hero.setTier(9);
    
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("boots");
    
    hero.addPowers("emo:cosmic");
    hero.addAttribute("PUNCH_DAMAGE", 14.0, 0);
	hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 11000.0, 0);
    hero.addAttribute("SPRINT_SPEED", 2.10, 1);
    
    hero.addKeyBind("ENERGY_PROJECTION", "key.cosmicBeam", 1);
    hero.addKeyBind("SHIELD", "key.forcefield", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
    hero.addKeyBind("SHADOWDOME", "key.shadowDome", 4);
    
    hero.setDefaultScale(1.1);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setHasProperty(hasProperty);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}
