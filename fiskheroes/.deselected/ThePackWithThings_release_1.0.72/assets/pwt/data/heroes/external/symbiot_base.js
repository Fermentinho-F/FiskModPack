function init(hero) {
	hero.setTier(8);
	
	hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
	
	hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
	hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
	hero.addKeyBindFunc("func_GIANT_MODE", giantModeKey, "Symbiote", 5);
	
	hero.addSoundEvent("PUNCH", "pwt:symbiot_blade_punch");
	hero.addSoundEvent("HURT", ["pwt:symbiot_hit", "pwt:symbiot_hit_scream"]);
	
	hero.setTierOverride(entity => entity.getData("pwt:dyn/symbiot") ? 8 : 0);
	hero.addAttributeProfile("INACTIVE", profile => profile.revokeAugments());
    hero.setAttributeProfile(getProfile);
	hero.setModifierEnabled(isModifierEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setHasProperty((entity, property) => {
		switch (property) {
		case "MASK_TOGGLE":
			return entity.getData("pwt:dyn/symbiot_timer") == 1;
		case "BREATHE_SPACE":
			return !entity.getData("fiskheroes:mask_open") && entity.getData("pwt:dyn/symbiot");
		default:
			return false;
		}
	});	
	hero.setTickHandler(tickHandler); 
}

function tickHandler(entity, manager) {
	var symbiot = entity.getData('pwt:dyn/symbiot');
	var nbt = entity.getWornChestplate().nbt();
	
	if ( entity.getHealth() < 5 && !symbiot){
		manager.setData(entity, "pwt:dyn/symbiot", true);
		manager.setData(entity, "fiskheroes:size_state", symbiot ? -1 : 1);
	}
	if ( entity.motionY() < -2 && !entity.getData('fiskheroes:tentacle_lift') ) {
		if (!symbiot) {
			manager.setData(entity, "pwt:dyn/symbiot", true);
			manager.setData(entity, "fiskheroes:size_state", symbiot ? -1 : 1);
		}
		manager.setData(entity, 'fiskheroes:tentacle_lift', true);
	}
	manager.incrementData(entity, "pwt:dyn/levitate_timer", 6, entity.getData("fiskheroes:tentacle_lift") && !entity.isOnGround());
	
	return true;
}

function getProfile(entity) {
	if (!entity.getData("pwt:dyn/symbiot") ) {
        return "INACTIVE";
    }
    return null;
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }
	manager.setDataWithNotify(player, "fiskheroes:tentacles_retracting", true);
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function giantModeKey(player, manager) {
    var flag = player.getData("pwt:dyn/symbiot");
    manager.setData(player, "pwt:dyn/symbiot", !flag);
    manager.setData(player, "fiskheroes:size_state", flag ? -1 : 1);
    return true;
}

function isModifierEnabled(entity, modifier) {
	var canWebSwing = entity.getWornChestplate().nbt().getBoolean("WEBSWINGING")
    if (modifier.name() == "fiskheroes:size_manipulation") {
        var giant = entity.getData("pwt:dyn/symbiot_timer") > 0;
        return modifier.id() == "giant" ? giant : !giant;
    }
	if (!entity.getData("pwt:dyn/symbiot") ) {
		return  modifier.name() == 'fiskheroes:cooldown' || modifier.name() == 'fiskheroes:regeneration' || modifier.name() == 'fiskheroes:potion_immunity' || modifier.name() == 'fiskheroes:fire_weakness' || modifier.name() == 'fiskheroes:healing_factor';
	}
	
	switch (modifier.name()) {
	case "fiskheroes:web_swinging":
        return canWebSwing && entity.getData("fiskheroes:tentacles") == null && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
	case "fiskheroes:web_zip":
        return canWebSwing && entity.getData("fiskheroes:tentacles") == null ;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (canWebSwing && entity.getData("fiskheroes:tentacles") == null && entity.getData("fiskheroes:ticks_since_swinging") < 5) ;
	case "fiskheroes:equipment":
        return !entity.getData('fiskheroes:blade') && entity.getData("fiskheroes:tentacles") == null;	
	case "fiskheroes:arrow_catching":
        return !entity.getData('fiskheroes:blade');
	}
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
	var canWebSwing = entity.getWornChestplate().nbt().getBoolean("WEBSWINGING")
	if (keyBind == "func_GIANT_MODE") {
        return entity.getData("fiskheroes:mask_open_timer") == 0 && (!entity.getData('pwt:dyn/symbiot') || (entity.getData('pwt:dyn/symbiot') && entity.isSneaking()) );
    }
    else if (!entity.getData("pwt:dyn/symbiot")) {
        return false;
    }
	if (keyBind.startsWith("TENTACLE_") && entity.getData("fiskheroes:tentacles") == null) {
		return false;
	}
    switch (keyBind) {
	case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() && canWebSwing;
	case "WEB_ZIP":
        return canWebSwing && entity.getData("fiskheroes:tentacles") == null;
    case "SIZE_MANIPULATION":
        return !entity.getData("pwt:dyn/symbiot");
	case "TENTACLES":
        return entity.getData("pwt:dyn/symbiot_timer") == 1 && !entity.isSneaking();
	case "UTILITY_BELT":
        return entity.getData("fiskheroes:tentacles") == null && !entity.getData('fiskheroes:blade');
	}

	return true;
}