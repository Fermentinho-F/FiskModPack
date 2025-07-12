function init(hero) {
    hero.setName("Utopian");
    hero.setTier(8);
    
    hero.setChestplate("suit");
       
    hero.addPowers("emo:utopian", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 14.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.9, 1);
    hero.addAttribute("MAX_HEALTH", 8.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
    
    hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
    hero.addKeyBind("CHARGED_BEAM", "Thunder Clap", 2);
    hero.addKeyBind("SUPER_SPEED", "speed", 3);
	hero.addKeyBind("SLOW_MOTION", "slow time", 4);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 5);
	
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}