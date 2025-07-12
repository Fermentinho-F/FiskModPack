function init(hero) {
    hero.setName("Superboy (Young Justice)");
    hero.setTier(7);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
       
    hero.addPowers("emo:project_kr", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("JUMP_HEIGHT", 7.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    
    hero.addKeyBind("CHARGED_BEAM", "freeze breath", 1);
    hero.addKeyBind("SUPER_SPEED", "speed", 2);
    hero.addKeyBind("SLOW_MOTION", "slow time", 3);
    hero.addKeyBind("EARTHQUAKE", "Earth Quake", 4);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 5);
	
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}