function init(hero) {
    hero.setName("SuperBat");
    hero.setTier(9);
    hero.hide();
    
    hero.setChestplate("suit");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
       
    hero.addPowers("emo:kryptonian", "emo:bat", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 6.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);
    
    hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
    hero.addKeyBind("CHARGED_BEAM", "Freeze breath", 2);
    hero.addKeyBind("UTILITY_BELT", "Utility Belt", 3);
    hero.addKeyBind("SUPER_SPEED", "Speed", 4);
	hero.addKeyBind("SLOW_MOTION", "Slow time", 5);
	
    hero.setDefaultScale(1.2);
    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}