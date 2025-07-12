function init(hero) {
    hero.setName("Ikaris");
    hero.setTier(7);
    
    hero.setChestplate("Suit");

    hero.addPowers("emo:eternal", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 13.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.9, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
    
    hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
    hero.addKeyBind("SUPER_SPEED", "speed", 2);
    hero.addKeyBind("SLOW_MOTION", "slow vision", 3);
	
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}