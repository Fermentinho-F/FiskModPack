function init(hero) {
    hero.setName("Green Arrow/Oliver Queen");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.hood");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("loriatpack:archery_ga");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
	hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
	hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.18, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.6, 1);
    
	hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
	
    hero.addKeyBind("HORIZONTAL_BOW", "Horizontal Bow", 1);
	hero.setTickHandler(tickHandler);
	hero.setHasProperty(hasProperty);
}

function tickHandler(entity, manager) {	
		manager.incrementData(entity, "loriatpack:dyn/mask_open_timer", 10, 15, entity.getData("fiskheroes:mask_open"));
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" ;
}
