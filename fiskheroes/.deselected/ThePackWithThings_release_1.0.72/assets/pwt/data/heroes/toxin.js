var symbiot_base = implement("pwt:external/symbiot_base");

function init(hero) {
    hero.setName("Toxin");
	hero.setVersion("P. Mulligan");

	hero.setChestplate("Symbiote");

    hero.addPowers("pwt:symbiot_toxin")
	
	hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.75, 0);
    hero.addAttribute("FALL_RESISTANCE", 30.0, 0);
	hero.addAttribute("BASE_SPEED", 0.1, 1);
	hero.addAttribute("MAX_HEALTH", 5.0, 0);
	hero.addAttribute("SPRINT_SPEED", 0.65, 1);
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
	
	hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);	
	hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_STRIKE", "key.tentacleStrike", 2);
    hero.addKeyBind("TENTACLES", "Tentacles", 5);
	
	hero.addKeyBind("BLADE", "Toggle Claws", 4);
	
	hero.addDamageProfile("RAGE", {"types": {"BLUNT": 1.0}, "properties": {"HIT_COOLDOWN": 8.0} });
	
	hero.addDamageProfile("BLADE", {"types": {"BLUNT": 0.2, "SHARP": 0.8}, "properties": {"HIT_COOLDOWN": 9.0} });
	
	hero.addDamageProfile("RAGE_BLADE", {
        "types": {
            "BLUNT": 0.2,
            "SHARP": 0.8
        },
        "properties": {
			"HIT_COOLDOWN": 8.0,
			"EFFECTS": [
				{
					"id": "minecraft:poison",
					"duration": 60,
					"amplifier": 1,
					"chance": 0.7
				}
			]
        }
    });
	
	hero.addAttributeProfile("RAGE", rageProfile);
	hero.addAttributeProfile("RAGE_BLADE", rageProfile);
	
	hero.setDamageProfile(getProfile);

	symbiot_base.init(hero);
	
	hero.setHasProperty((entity, property) => {
		switch (property) {
		case "MASK_TOGGLE":
			return entity.getData("pwt:dyn/symbiot_timer") == 1 && entity.getData("pwt:dyn/ability_timer") == 0;
		case "BREATHE_SPACE":
			return !entity.getData("fiskheroes:mask_open") && entity.getData("pwt:dyn/symbiot");
		default:
			return false;
		}
	});	
	hero.setAttributeProfile(getProfile);
	hero.setModifierEnabled(isModifierEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler(tickHandler); 
}

function rageModeKey(player, manager) {
    var flag = player.getData("pwt:dyn/ability");
    manager.setData(player, "pwt:dyn/ability", !flag);
    
    return true;
}

function tickHandler(entity, manager) {
	manager.incrementData(entity, "pwt:dyn/cooldown_interp_1", 10, 30, (entity.loop(1200)*entity.getData('pwt:dyn/symbiot_timer'))>=0.98 && entity.motion().length() < 0.1 && entity.getData('fiskheroes:mask_open_timer2')==0);
	manager.incrementData(entity, "pwt:dyn/cooldown_interp_2", 5, 10, (entity.loop(3000)*entity.getData('pwt:dyn/symbiot_timer'))>=0.96 );
	if (!entity.getWornChestplate().nbt().getBoolean("WEBSWINGING")) {
		manager.setBoolean(entity.getWornChestplate().nbt(), 'WEBSWINGING', true);
	}
	
	if ( ( (entity.loop(2000) > 0.9 && entity.loop(800) > 0.9 &&  Math.random() > 0.9)|| (entity.getData('pwt:dyn/cooldown_interp_1') > 0.5 && entity.loop(1700) > 0.9 && entity.loop(800) > 0.9 && Math.random() > 0.9)) && entity.getData('pwt:dyn/symbiot') && !entity.getData('pwt:dyn/ability') && entity.getData('pwt:dyn/ability_cooldown') <= 0) {
		manager.setData(entity, "fiskheroes:mask_open", false);
		manager.setData(entity, "pwt:dyn/ability", true);
		manager.setData(entity, "fiskheroes:size_state", 1);
		
	}
	
	if (entity.getData('fiskheroes:size_state') == 1 && !entity.getData("pwt:dyn/ability") && entity.getData('pwt:dyn/symbiot_timer') == 1) {
	manager.setData(entity, "fiskheroes:size_state", -1);
	}	
	
	return symbiot_base.tickHandler(entity, manager);
}

function rageProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("JUMP_HEIGHT", 4.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 35.0, 0);
	profile.addAttribute("BASE_SPEED", 0.15, 1);
	profile.addAttribute("SPRINT_SPEED", 0.7, 1);
}

function getProfile(entity) {
	if (entity.getData('pwt:dyn/ability') && !entity.getData('fiskheroes:blade')) {
        return "RAGE";
	}
	else if (entity.getData('fiskheroes:blade') && !entity.getData('pwt:dyn/ability')) {
        return "BLADE";
	}
	else if (entity.getData('pwt:dyn/ability') && entity.getData('fiskheroes:blade')) {
        return "RAGE_BLADE";
	}
    return symbiot_base.getProfile(entity);
}

function isModifierEnabled(entity, modifier) {
	if (modifier.name() == "fiskheroes:size_manipulation") {
        var giant = entity.getData("pwt:dyn/symbiot_timer") > 0;
		var rage = entity.getData("pwt:dyn/ability_timer") > 0;
        return (modifier.id() == "giant" == giant && !rage) || modifier.id() == "giant_rage" == rage
    }
	switch (modifier.name()) {
	case "fiskheroes:cooldown":
        return (modifier.id() == "symbiot_cooldown" == !entity.getData('pwt:dyn/ability')) ||  modifier.id() == "ability_cooldown" ;
    }
    return symbiot_base.isModifierEnabled(entity, modifier);
}

function isKeyBindEnabled(entity, keyBind) {	
	if (keyBind == "func_GIANT_MODE") {
        return entity.getData("fiskheroes:mask_open_timer") == 0 && (!entity.getData('pwt:dyn/symbiot') || (entity.getData('pwt:dyn/symbiot') && entity.isSneaking()) ) && !entity.getData('pwt:dyn/ability');
    }
    else if (!entity.getData("pwt:dyn/symbiot")) {
        return false;
    }
	
	if (entity.getData("pwt:dyn/symbiot") && keyBind.startsWith("func_BLADE_")) {
        return !entity.getWornChestplate().nbt().getBoolean("SelectCooldown") && keyBind == ("func_BLADE_" + weapon);
    }
	switch (keyBind) {
	case "func_RAGE_MODE" :
		return entity.getData("pwt:dyn/symbiot_timer")==1 && !entity.isSneaking();
	}
	return symbiot_base.isKeyBindEnabled(entity, keyBind);
}