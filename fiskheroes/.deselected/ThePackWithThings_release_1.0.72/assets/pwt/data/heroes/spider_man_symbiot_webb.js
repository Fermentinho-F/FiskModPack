var ban = implement("pwt:external/switch");
function init(hero) {
    hero.setName("Spider-Man");
	hero.setVersion("Symbiote Suit (Webb)");
    hero.setTier(8);
	

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");


    hero.addPowers("fiskheroes:spider_physiology", "fiskheroes:web_shooters_webb", "pwt:symbiot_venom_spider_man_webb")
	
	hero.addAttribute("FALL_RESISTANCE", 14.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.7, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.55, 1);
	
	
	hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
	hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
		
	hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
	hero.addKeyBindFunc("CURE", choice,"Remove Symbiote", 5);
	hero.addKeyBindFunc("SYMBIOTE_SUIT", choice,"Keep The Symbiote", 5);
	
	hero.addKeyBindFunc("YES", yesFunc, "\u00A7aYes", 1);
	
	hero.addKeyBindFunc("NO", noFunc, "\u00A7cNo", 2);
	
	
	hero.addKeyBindFunc("func_GIANT_MODE", giantModeKey, "Symbiote", 5);

	
	
	
	hero.setAttributeProfile(getAttributeProfile);
		hero.addAttributeProfile("INACTIVE", inactiveProfile);
		hero.addAttributeProfile("1", phase1Profile);
		hero.addAttributeProfile("2", phase2Profile);
		hero.addAttributeProfile("PUNISHMENT", punishProfile);
		
	hero.setModifierEnabled(isModifierEnabled);
	hero.setTierOverride(getTierOverride);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler((entity, manager) => {
        if (entity.getWornChestplate().nbt().getBoolean("SelectCooldown")) {
            manager.setBoolean(entity.getWornChestplate().nbt(), "SelectCooldown", false);
        }
		
		if (entity.getData("pwt:dyn/cooldown_1") > 0.50) {
            manager.setData(entity, "pwt:dyn/symbiot", true);
        }
		ban.tick(entity, manager);
    });
}

function isKeyBindEnabled(entity, keyBind) {
	
	var cycle = entity.getData("pwt:dyn/cycle");
	
	if (keyBind == "func_GIANT_MODE") {
        return (!entity.getData('pwt:dyn/symbiot') || entity.getData("pwt:dyn/cooldown_1") < 0.50) && (!(entity.isBurning() && entity.isSneaking())|| (entity.isBurning() && entity.getData('pwt:dyn/symbiot')));
    }
	if (keyBind == "SIZE_MANIPULATION") {
        return !entity.getData("pwt:dyn/symbiot");
    }
	if (keyBind == "YES" || keyBind == "NO") {
			return entity.getWornChestplate().nbt().getBoolean('ChoiceMenu');
	}	
	if (entity.getWornChestplate().nbt().getBoolean('ChoiceMenu')) {
		if (keyBind == "YES" || keyBind == "NO") {
			return entity.getWornChestplate().nbt().getBoolean('ChoiceMenu');
		}	
        return (keyBind == "CURE" && entity.isBurning()) || keyBind == "SYMBIOTE_SUIT";
    }

	
    switch (keyBind) {
	case "CURE":
        return entity.getData("pwt:dyn/cooldown_1") < 0.2 && !entity.getData('pwt:dyn/symbiot') && entity.isBurning() && entity.isSneaking();
	case "SYMBIOTE_SUIT":
        return entity.getData("pwt:dyn/cooldown_1") == 1 && entity.getData('pwt:dyn/symbiot') && entity.isSneaking();
	case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() ;
    default:
        return !entity.getWornChestplate().nbt().getBoolean("SelectCooldown");
    }
}

function choice(player, manager) {
	manager.setBoolean(player.getWornChestplate().nbt(), 'ChoiceMenu', true);
	var cycle = player.getData("pwt:dyn/cycle");
	
	if (player.isBurning() && !player.getData('pwt:dyn/symbiot') &&  player.getData("pwt:dyn/cooldown_1") < 0.2){
	manager.setData(player, "pwt:dyn/cycle", 1);
	
	}
	
	if (cycle !=2 && player.getData("pwt:dyn/cooldown_1") == 1 ){
	manager.setData(player, "pwt:dyn/cycle", 2);
	}
	
	if (cycle == 1 || cycle == 2){
	manager.setData(player, "pwt:dyn/cycle", cycle);
	}
	
	manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
	
	manager.setBoolean(player.getWornChestplate().nbt(), "SelectCooldown", true);
    return true;
}

function yesFunc(player, manager) {
	var cycle = player.getData("pwt:dyn/cycle");
	
	if (cycle == 1){
		
		var nbt1 = player.getEquipmentInSlot(1).nbt();
		var nbt2 = player.getEquipmentInSlot(2).nbt();
		var nbt3 = player.getEquipmentInSlot(3).nbt();
		var nbt4 = player.getEquipmentInSlot(4).nbt();
				
			
		manager.setString(nbt1, "HeroType", "fiskheroes:spider_man_webb");
		manager.setString(nbt2, "HeroType", "fiskheroes:spider_man_webb");	
		manager.setString(nbt3, "HeroType", "fiskheroes:spider_man_webb");	
		manager.setString(nbt4, "HeroType", "fiskheroes:spider_man_webb");	
		
		manager.setData(player, "pwt:dyn/cycle", 0);
	
	}
	
	if(cycle == 2){
		
		var nbt1 = player.getEquipmentInSlot(1).nbt();
		var nbt2 = player.getEquipmentInSlot(2).nbt();
		var nbt3 = player.getEquipmentInSlot(3).nbt();
		var nbt4 = player.getEquipmentInSlot(4).nbt();
				
			
		manager.setString(nbt1, "HeroType", "pwt:spider_man_symbiot_webb_3");
		manager.setString(nbt2, "HeroType", "pwt:spider_man_symbiot_webb_3");	
		manager.setString(nbt3, "HeroType", "pwt:spider_man_symbiot_webb_3");	
		manager.setString(nbt4, "HeroType", "pwt:spider_man_symbiot_webb_3");	
		
		manager.setData(player, "pwt:dyn/cycle", 0);
	
	}
	manager.setBoolean(player.getWornChestplate().nbt(), "SelectCooldown", true);
	manager.setBoolean(player.getWornChestplate().nbt(), 'ChoiceMenu', false);
	
    return true;
}

function noFunc(player, manager) {
	
	manager.setData(player, "pwt:dyn/cycle", 0);
	manager.setData(player, "pwt:dyn/cooldown_1", 0.0);
	manager.setBoolean(player.getWornChestplate().nbt(), "SelectCooldown", true);
	manager.setBoolean(player.getWornChestplate().nbt(), 'ChoiceMenu', false);
	
	
    return true;
}

function inactiveProfile(profile) {
	profile.addAttribute("FALL_RESISTANCE", 13.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 2.5, 0);
    profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.5, 1);
}

function phase1Profile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("FALL_RESISTANCE", 15.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 2.9, 0);
    profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.7, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.6, 1);
}

function phase2Profile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("FALL_RESISTANCE", 16.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 3.0, 0);
    profile.addAttribute("PUNCH_DAMAGE", 9.25, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.65, 1);
}

function punishProfile(profile) {
    profile.revokeAugments();
	profile.addAttribute("MAX_HEALTH", -10000000.0, 0);

}

function getAttributeProfile(entity) {
	if (entity.getData('pwt:dyn/punishment')) {
        return "PUNISHMENT";
    }
	if (!entity.getData("pwt:dyn/symbiot") ) {
        return "INACTIVE";
    }
	else if (entity.getData("pwt:dyn/symbiot") && entity.getData("pwt:dyn/cooldown_1") >= 0.50 && entity.getData("pwt:dyn/cooldown_1") < 0.95) {
        return "1";
    }
	else if (entity.getData("pwt:dyn/symbiot") && entity.getData("pwt:dyn/cooldown_1") >= 0.95) {
        return "2";
    }
	
	
    return null;
}




function getTierOverride(entity) {
    return entity.getData("pwt:dyn/symbiot") ? 8 : 7;
}

function giantModeKey(player, manager) {
	var timer_cooldown = player.getData("pwt:dyn/symbiot_cooldown"); 
	
    var flag = player.getData("pwt:dyn/symbiot");
    manager.setData(player, "pwt:dyn/symbiot", !flag);
    manager.setData(player, "fiskheroes:size_state", flag ? -1 : 1);
	

	
    return true;
}

function symbioteModeKey(player, manager) {
    var flag = player.getData("pwt:dyn/symbiot");
	manager.setData(player, "pwt:dyn/symbiot", true);
	manager.setData(player, "pwt:dyn/symbiot_cooldown", 0.999);
	manager.setDataWithNotify(player, "fiskheroes:tentacles_retracting", true);
    return true;
}


function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }

    
	manager.setDataWithNotify(player, "fiskheroes:tentacles_retracting", !flag);
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function Tentacles(player, manager) {
    var flag = player.getData("fiskheroes:tentacles") != null;
    

	if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:web_swinging", flag);

    }
    return true;
}

function isModifierEnabled(entity, modifier) {
	var cycle = entity.getData("pwt:dyn/cycle");
	
    if (modifier.name() == "fiskheroes:size_manipulation" ) {
        var giant = entity.getData("pwt:dyn/symbiot_timer") > 0;
        return (modifier.id() == "giant" ? giant : !giant);
    }
	
	 if (modifier.name() == "fiskheroes:cooldown" ) {

		
		if (modifier.id() == "symbiot_cooldown" ) {

			return  !entity.getData("pwt:dyn/ability");
		}
		else if (modifier.id() == "ability_cooldown" ) {

			return entity.getData("pwt:dyn/ability") || true;
		}
        return true;
    }


	switch (modifier.name()) {
	case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1  && (modifier.id() == "symbiot_swing" == (entity.getData("pwt:dyn/symbiot"))) ;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5) ;
	
	case "fiskheroes:tentacles":
        return entity.getData("pwt:dyn/cooldown_1") >= 0.50;
	case "fiskheroes:water_breathing":
        return entity.getData("pwt:dyn/symbiot");
	
	case "fiskheroes:equipment":
        return entity.getData("fiskheroes:tentacles") == null && (modifier.id() == "symbiot_equipment" == (entity.getData("pwt:dyn/symbiot")));
	case "fiskheroes:web_zip":
        return modifier.id() == "symbiot_zip" == (entity.getData("pwt:dyn/symbiot"));

    default:
        return true;
    }
    return true;
}



