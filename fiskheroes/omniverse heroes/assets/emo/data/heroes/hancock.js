function init(hero) {
    hero.setName("Hancock");
    hero.setTier(9);
    
    hero.setChestplate("suit");
       
    hero.addPowers("emo:hancock", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 5.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 4.0, 0);
    
    hero.addKeyBind("CHARGED_BEAM", "Wind Burst", 1);
    hero.addKeyBind("EARTHQUAKE", "Earth Quake", 2);
    hero.addKeyBind("SUPER_SPEED", "speed", 3);
	hero.addKeyBind("SLOW_MOTION", "slow time", 4);
	
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
