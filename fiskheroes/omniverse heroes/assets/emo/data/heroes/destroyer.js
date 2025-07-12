function init(hero) {
    hero.setName("Destroyer");
    hero.setTier(7);
    
    hero.setChestplate("armor");
       
    hero.addPowers("emo:destroyer", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("JUMP_HEIGHT", 7.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 4.0, 0);
    
    hero.addKeyBind("CHARGED_BEAM", "Charged Beam", 1);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 2);
	
    hero.setDefaultScale(7.0);
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}