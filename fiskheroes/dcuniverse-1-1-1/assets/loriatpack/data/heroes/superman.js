var utils = implement("fiskheroes:external/utils");
function init(hero) {
    hero.setName("Superman/Clark Kent");
    hero.setTier(9);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("loriatpack:kryptonian")
    hero.addAttribute("PUNCH_DAMAGE", 13.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.8, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
	hero.addAttribute("MAX_HEALTH", 16.0, 0);
	
	hero.addKeyBind("HEAT_VISION", "Heat Vision", 4);
	hero.addKeyBind("ENERGY_PROJECTION", "Cold Breath", 1);	
	
	hero.addKeyBind("SWITCH", "Switch Abilities", 3);
    
	hero.addKeyBind("CHARGED_BEAM", "Thunder Clap", 4);
	hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 1);
	
	hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);	
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 5);
	
	hero.addKeyBind("TELEPORT", "Teleport To The Moon", 3);  
	
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler(tickHandler);

    hero.addAttributeProfile("JUMP", jumpProfile);
    hero.setAttributeProfile(getProfile);
}
	
function tickHandler(entity, manager) {
        manager.incrementData(entity, "loriatpack:dyn/jump_timer", 20, 25, entity.isSneaking() && entity.motionX() == 0 && entity.motionY() == 0);
        if (!entity.isOnGround()) {
        manager.setData(entity, "loriatpack:dyn/jump_timer", 0);
        manager.setData(entity, "loriatpack:dyn/jump_cooldown", 0);
        }
		if (!entity.isOnGround() && entity.posY() > 100 ) {
        manager.setData(entity, "fiskheroes:flying", true);
    }
}

function jumpProfile(profile) {
        profile.addAttribute("JUMP_HEIGHT", 30.0, 0);
        profile.addAttribute("SPRINT_SPEED", 0.8, 1);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);		
		profile.addAttribute("PUNCH_DAMAGE", 13.0, 0);
		profile.addAttribute("BASE_SPEED_LEVELS", 4.0, 0);
		profile.addAttribute("STEP_HEIGHT", 0.5, 0);
		profile.addAttribute("MAX_HEALTH", 16.0, 0);
}

function getProfile(entity) {
        if (entity.getData("loriatpack:dyn/jump_cooldown") == 1) {
            return "JUMP";
        }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:super_speed":
            return !entity.getData("fiskheroes:flying");
        case "fiskheroes:slow_motion":
            return !entity.getData("fiskheroes:flying");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {  
	switch (keyBind) {
	case "GROUND_SMASH":
		return entity.getData("loriatpack:dyn/switch_turn");
	case "ENERGY_PROJECTION":
		return !entity.getData("loriatpack:dyn/switch_turn");
	case "HEAT_VISION":
		return !entity.getData("loriatpack:dyn/switch_turn");
	case "CHARGED_BEAM":
		return entity.getData("loriatpack:dyn/switch_turn");
	case "SUPER_SPEED":
		return !entity.getData("fiskheroes:flying")
	case "SLOW_MOTION":
		return entity.isAlive();
	case "SWITCH":
		return entity.isAlive() && entity.posY() < 700;	
	case "TELEPORT":
          return entity.posY() > 700;
	default:
        return true
    }
}