function init(hero) {
    hero.setName("Green Lantern/Hal Jordan");
    hero.setTier(9);   

    hero.setChestplate("Green Ring");

    hero.addPowers("loriatpack:green_ring");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
	hero.addAttribute("SPRINT_SPEED", 0.15, 1);
	
    hero.addKeyBind("RING", "Transformation", 3);
	hero.addKeyBind("AIM", "key.aim", 2);
    	hero.addKeyBind("TENTACLES", "Create Chains", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Miniguns", 4);
	hero.addKeyBind("SHIELD", "Create Safe", 3);
	  
	
    hero.addKeyBindFunc("func_RELOAD", ringReload, "Ring Reload", 2);
	
	hero.addKeyBind("SWITCH", "Switch Abilities", 5);
	
	
        hero.addKeyBind("CHARGED_BEAM", "Energy Beam", 1);
	hero.addKeyBind("TELEPORT", "Teleport To The Moon", 2);
	hero.addKeyBind("TELEKINESIS", "Telekinesis", 4);
	hero.addKeyBind("TENTACLES", "Create Chains", 3);
	
	
	hero.addKeyBind("TENTACLE_JAB", "Chains Jab", 4);
	hero.addKeyBind("TENTACLE_STRIKE", "Chains Strike", 2);
    

    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTickHandler(tickHandler); 
    hero.supplyFunction("canAim", canAim);
	
	hero.addAttributeProfile("GLOVE", gloveProfile);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
	hero.addDamageProfile("GLOVE", {"types": {"BLUNT": 1.0}});	
}   
function tickHandler(entity, manager) {
       if (entity.getData("loriatpack:dyn/ring_cooldown") == 1) {
         manager.setData(entity, "loriatpack:dyn/ring_active", false)
       }
    manager.incrementData(entity, "loriatpack:dyn/ring_reload_timer", 15, 20, entity.getData("loriatpack:dyn/ring_reload"));
 if (entity.getData("loriatpack:dyn/ring_reload_cooldown") == 1) {
    manager.setData(entity, "loriatpack:dyn/ring_cooldown", 0);
    }
return true;
}

function ringReload(entity, manager) {
    flag = entity.getData("loriatpack:dyn/ring_reload");
    manager.setData(entity, "loriatpack:dyn/ring_reload", !flag);
    return true;
}

function getTierOverride(entity) {
    return entity.getData("loriatpack:dyn/ring_active") ? 7 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function gloveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
}

function getProfile(entity) {
    if (!entity.getData("loriatpack:dyn/ring_active")) {
        return "INACTIVE";
    }
	if (entity.getData("fiskheroes:blade")) {
        return "GLOVE";
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("loriatpack:dyn/ring_active");
        case "fiskheroes:tentacles":
            return entity.getData("loriatpack:dyn/ring_active") && entity.getHeldItem().isEmpty();
		case "fiskheroes:blade":
            return entity.getData("loriatpack:dyn/ring_active") && !entity.getData("fiskheroes:tentacles") == 1;
        default:
            return true;

    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
		case "RING":
            return !entity.getData("fiskheroes:tentacles") == 1 && !entity.getData("loriatpack:dyn/switch_turn") && !entity.getData("loriatpack:dyn/ring_reload") && entity.posY() < 700;	
        case "TENTACLE_JAB":
            return !entity.getData("fiskheroes:tentacles") == 0;
		case "TENTACLE_STRIKE":
            return !entity.getData("fiskheroes:tentacles") == 0;
		case "TENTACLES":
			return entity.getData("loriatpack:dyn/ring_active") && entity.getData("loriatpack:dyn/switch_turn") && entity.posY() < 700;	
        case "SWITCH":
			return entity.getData("loriatpack:dyn/ring_active") && !entity.getData("fiskheroes:tentacles") == 1;
		case "CHARGED_BEAM":
            return entity.getData("loriatpack:dyn/ring_active") && !entity.getData("fiskheroes:tentacle_extend_timer") && !entity.getData("fiskheroes:tentacles") == 1 && !entity.getData("loriatpack:dyn/switch_turn");
        case "ENERGY_PROJECTION":
            return entity.getData("loriatpack:dyn/ring_active") && !entity.getData("fiskheroes:tentacle_extend_timer") && !entity.getData("fiskheroes:tentacles") == 1 && !entity.getData("loriatpack:dyn/switch_turn");
		case "AIM":    
            return entity.getData("loriatpack:dyn/ring_active") && !entity.getData("fiskheroes:tentacle_extend_timer") && !entity.getData("fiskheroes:tentacles") == 1 && !entity.getData("loriatpack:dyn/switch_turn");
        case "SHIELD":    
            return entity.getData("loriatpack:dyn/ring_active") && !entity.getData("fiskheroes:tentacle_extend_timer") && !entity.getData("fiskheroes:tentacles") == 1 && entity.getData("loriatpack:dyn/switch_turn");
        case "TELEKINESIS":    
            return entity.getData("loriatpack:dyn/ring_active") && !entity.getData("fiskheroes:tentacle_extend_timer") && !entity.getData("fiskheroes:tentacles") == 1 && entity.getData("loriatpack:dyn/switch_turn");
		case "BLADE":
			return entity.getData("loriatpack:dyn/ring_active") && entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:tentacles") == 1 && entity.getData("loriatpack:dyn/switch_turn");
		case "func_RELOAD":
            return !entity.getData("loriatpack:dyn/ring_active");
		case "TELEPORT":
          return entity.getData("loriatpack:dyn/ring_active") && entity.posY() > 700;
        default:
            return true;

}
}

function hasProperty(entity, property) {
    switch (property) {
        case "BREATHE_SPACE":
            return entity.getData("loriatpack:dyn/ring_active");
        default:
            return false;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}