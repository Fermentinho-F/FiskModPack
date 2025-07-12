function init(hero) {
    hero.setName("Lex Luthor (Crisis On Infinite Earths)");
    hero.setTier(7);
    
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("boots");
    
    hero.addPowers("emo:luthor");
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
	hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 11000.0, 0);
    hero.addAttribute("SPRINT_SPEED", 1.10, 1);
    
    hero.addKeyBind("CHARGED_BEAM", "Energy Blast", 1);
    hero.addKeyBind("AIM", "Mini Energy Blast", 2);
    
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}