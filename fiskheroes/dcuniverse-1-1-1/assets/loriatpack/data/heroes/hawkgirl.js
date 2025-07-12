function init(hero) {
    hero.setName("Hawkgirl/Shiera Sanders");
    hero.setTier(6);
    
    hero.setHelmet("Mask");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    
    hero.addPowers("loriatpack:thanagarian_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
	hero.addAttribute("SPRINT_SPEED", 0.2, 1);
	hero.addAttribute("MAX_HEALTH", 2.0, 0);
    
	hero.addKeyBind("BLADE", "Draw Mace", 1);
	hero.addKeyBind("CHARGE_ENERGY", "key.chargeEnergy", 4);
	hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 5);
	
	hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
	
	hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
		
	hero.addAttributeProfile("BLADE", battonstProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"BLUNT": 1.0}});	
	hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler(tick);
}

function tick(entity, manager) {
manager.incrementData(entity, "loriatpack:dyn/mask_open_timer", 10, 15, entity.getData("fiskheroes:mask_open"));
}

function battonstProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:energy_manipulation" || entity.getData("fiskheroes:blade");
}

function isKeyBindEnabled(entity, keyBind) {
	switch (keyBind) {
	case "GROUND_SMASH":
        return entity.getData("fiskheroes:blade") ;
	case "CHARGE_ENERGY":
        return entity.getData("fiskheroes:blade");
    case "BLADE":
        return entity.getHeldItem().isEmpty()
    default:
        return true;
    }
}