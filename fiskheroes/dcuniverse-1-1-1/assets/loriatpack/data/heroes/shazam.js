function init(hero) {
    hero.setName("Shazam/Billy Batson");
    hero.setTier(9);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("loriatpack:divine_empowerment");
    hero.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    hero.addAttribute("MAX_HEALTH", 12.0, 0);
	
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SHAZAM", "SHAZAM", 5)
    hero.addKeyBind("ENERGY_PROJECTION", "Lightning Beam", 4)
    hero.addKeyBind("TELEPORT", "Teleport To The Moon", 3);  
	hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 2);
	
	hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
	
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setDefaultScale(defaultScale);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setHasProperty(hasProperty);
	hero.setTickHandler(tickHandler);
}

function tickHandler(entity, manager) {	
		manager.incrementData(entity, "loriatpack:dyn/mask_open_timer", 10, 15, entity.getData("fiskheroes:mask_open"));
}
    
function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? 9 : 0;
}

function inactiveProfile(profile) {
     profile.revokeAugments();
}


function getAttributeProfile(entity) {
    if (!entity.getData("fiskheroes:dyn/nanites")) {
        return "INACTIVE";
    }
}

function defaultScale(entity) {
    if (entity.getData("fiskheroes:dyn/nanites")) {
        return 1.0;
    }
    return 0.8;
}
    function isModifierEnabled(entity, modifier) {
        if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("fiskheroes:dyn/nanites") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("fiskheroes:dyn/nanite_timer") < 1)) {
            return false;
        }  
        switch (modifier.name()) {
        case "fiskheroes:super_speed":
            return !entity.getData("fiskheroes:flying");
        default:
            return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    if (entity.hasStatusEffect("fiskheroes:eternium")) {
        return false;
    }
        switch (keyBind) {
            case "SUPER_SPEED":
                return entity.getData("fiskheroes:dyn/nanites") && !entity.getData("fiskheroes:flying");     
            case "ENERGY_PROJECTION":
                return entity.getData("fiskheroes:dyn/nanites");
			case "TELEPORT":
                return entity.getData("fiskheroes:dyn/nanites") && entity.posY() > 700;
			case "GROUND_SMASH":
        return entity.getData("fiskheroes:dyn/nanites");
            default:
                return true;
        }
}
    
function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE" && entity.getData("fiskheroes:dyn/nanites");
}

