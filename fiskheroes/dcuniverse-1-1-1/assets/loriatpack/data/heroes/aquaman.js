function init(hero) {
    hero.setName("Aquaman/Arthur Curry");
    hero.setTier(8);
    
    hero.setChestplate("Chestplate");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

	hero.addPowers("loriatpack:aquaman");
	hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
	hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 5.0, 0);
	hero.addAttribute("SPRINT_SPEED", 0.35, 1);
	hero.addAttribute("JUMP_HEIGHT", 1.0, 0);     
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
	hero.addAttribute("MAX_HEALTH", 8.0, 0);
    
	
	hero.addKeyBind("BLADE", "Draw Trident", 1);	
    hero.addKeyBind("CHARGED_BEAM", "Magic Blast", 4);
	hero.addKeyBind("SONIC_WAVES", "Vortex", 2);
	hero.addKeyBind("ENERGY_PROJECTION", "Vortex", 2);
	hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 4);
	
	hero.addKeyBind("TENTACLE_JAB", "Fish Jab", 1);
	hero.addKeyBind("TENTACLE_STRIKE", "Fish Strike", 2);
	hero.addKeyBind("TENTACLE_GRAB", "Fish Grab", 3);	
    hero.addKeyBind("TENTACLES", "Fish", 5);
	
    
	hero.setModifierEnabled(isModifierEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.addAttributeProfile("TRIDENT", tridentProfile);
	hero.setTickHandler(tickHandler);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("TRIDENT", {
        "types": {
            "SHARP": 1.0,
            "ATLANTEAN_STEEL": 1.0
        }
    });
}

function tickHandler(entity, manager) {	
        manager.incrementData(entity, "loriatpack:dyn/leap_timer", 1, 6, entity.isSprinting() && entity.getData("fiskheroes:flying") == 0 );
		
		if (!entity.isSneaking() && entity.isInWater()) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
}
	
function tridentProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12, 0);
	profile.addAttribute("REACH_DISTANCE", 4.0, 0);
}


function getProfile(entity) {
	if (entity.getData("fiskheroes:blade")) {
            return "TRIDENT";
        }
}

function isKeyBindEnabled(entity, keyBind) {  
	switch (keyBind) {
	case "TENTACLE_JAB":
            return !entity.getData("fiskheroes:tentacles") == 0;
	case "TENTACLE_GRAB":
            return !entity.getData("fiskheroes:tentacles") == 0;
	case "TENTACLE_STRIKE":
            return !entity.getData("fiskheroes:tentacles") == 0;
	case "TENTACLES":
        return !entity.getData("fiskheroes:blade") && entity.isInWater();
	case "GROUND_SMASH":
        return !entity.getData("fiskheroes:blade");
    case "BLADE":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:tentacles") == 1;
    case "CHARGED_BEAM":
        return entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:energy_projection");
	case "SONIC_WAVES":
        return entity.getData("fiskheroes:blade");	
	case "ENERGY_PROJECTION":
        return entity.getData("fiskheroes:blade");	
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
	switch (modifier.name()) {
        case "fiskheroes:leaping":
            return modifier.id() == "1" && entity.getData("loriatpack:dyn/leap_cooldown") < 1 || modifier.id() == "2" && entity.getData("loriatpack:dyn/leap_cooldown") == 1 ;
		case "fiskheroes:controlled_flight":
            return entity.isInWater();  
		case "fiskheroes:tentacles":
            return entity.isInWater(); 
        default:
            return true;
        }
}
