var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Wonder Woman/Diana of Themyscira");
    hero.setTier(9);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:captain_americas_shield{Electromagnetic:1,display:{Name:\"Wonder Woman's Shield\"}}", true);

    hero.addPowers("loriatpack:ww", "fiskheroes:shield_throwing")
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.75, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
	hero.addAttribute("MAX_HEALTH", 14.0, 0);
	
    hero.addKeyBind("TELEKINESIS", "Use Lasso", 1);
	hero.addKeyBind("AIM", "Use Lasso", 1);
    hero.addKeyBind("BLADE", "Toggle Sword", 1)
    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 5);
    hero.addKeyBind("LASSO", "Toggle Lasso", 4)
    hero.addKeyBind("SHIELD", "Use Bracelets", 2)
	hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 3);
	
	hero.setTickHandler(tickHandler); 
	hero.setModifierEnabled(isModifierEnabled);
	hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission(hasPermission);
    hero.addAttributeProfile("BLADE", bladeProfile);
	hero.addAttributeProfile("LASO", lassoProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0
        }
    });
	hero.addDamageProfile("LASO", {
        "types": {
            "MAGIC": 1.0,
            "BLUNT": 0.5
        }
    });

    function bladeProfile(profile) {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    }
	function lassoProfile(profile) {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
		profile.addAttribute("REACH_DISTANCE", 5.0, 0);
    }
	
    function getProfile(entity) {
	if (entity.getData("fiskheroes:dyn/nanites") ) {
        return "LASO";
    }
	else if (entity.getData("fiskheroes:blade") ) {
        return "BLADE";
    }
	return false;
	}
}

function tickHandler(entity, manager) {     
        manager.incrementData(entity, "loriatpack:dyn/leap_timer", 1, 6, entity.isSprinting() && entity.getData("fiskheroes:flying") == 0 );         
}

function isModifierEnabled(entity, modifier) {
        switch (modifier.name()) {
        case "fiskheroes:leaping":
            return modifier.id() == "1" && entity.getData("loriatpack:dyn/leap_cooldown") < 1 || modifier.id() == "2" && entity.getData("loriatpack:dyn/leap_cooldown") == 1;        
        default:
            return true;
        }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "TELEKINESIS":
            return entity.getData("fiskheroes:dyn/nanites");
		case "AIM":
            return entity.getData("fiskheroes:dyn/nanites");
        case "LASSO":
            return !entity.getData("fiskheroes:blade");   
        case "BLADE":
            return !entity.getData("fiskheroes:dyn/nanites"); 
        case "SHIELD_THROW":
            return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
		case "GROUND_SMASH":
        return !entity.getData("fiskheroes:dyn/nanites") && !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shield_timer");
        default:
            return true;

    }   
}

function hasPermission(entity, permission) {
    return permission == "USE_SHIELD";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:grab_id") > -1;
}
