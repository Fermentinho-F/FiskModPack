function init(hero) {
    hero.setName("Bizarro (Smallville)");
    hero.setTier(7);
    
    hero.setChestplate("Suit");
       
    hero.addPowers("emo:pkryptonian", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 5.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    
    hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
    hero.addKeyBind("CHARGED_BEAM", "freeze breath", 2);
    hero.addKeyBind("SUPER_SPEED", "speed", 3);
	hero.addKeyBind("SLOW_MOTION", "slow time", 4);
    hero.addKeyBind("EARTHQUAKE", "Earth Quake", 5);
	
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}