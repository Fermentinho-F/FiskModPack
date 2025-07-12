function init(hero) {
    hero.setName("Hawkman/Carter Hall");
    hero.setTier(6);
    
    hero.setHelmet("Mask");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    
    hero.addPowers("loriatpack:thanagarian_physiology2");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
	hero.addAttribute("SPRINT_SPEED", 0.2, 1);
	hero.addAttribute("MAX_HEALTH", 4.0, 0);;
    
	hero.addKeyBind("BLADE", "Draw Axe", 1);
	hero.addKeyBind("SHIELD", "key.shield", 4);
	hero.addKeyBind("TELEPORT", "Teleport To The Moon", 3);  
	
	hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
	
	hero.addAttributeProfile("BLADE", battonstProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});	
	hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setHasProperty(hasProperty);
	hero.setTickHandler(tick);
}

function tick(entity, manager) {
manager.incrementData(entity, "loriatpack:dyn/mask_open_timer", 10, 15, entity.getData("fiskheroes:mask_open"));
}

function battonstProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:energy_manipulation" || entity.getData("fiskheroes:blade");
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "BLADE":
            return entity.isAlive();
		case "SHIELD":
            return entity.isAlive();
		case "TELEPORT":
          return  entity.posY() > 700;
        default:
            return true;

}
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE" ;
}