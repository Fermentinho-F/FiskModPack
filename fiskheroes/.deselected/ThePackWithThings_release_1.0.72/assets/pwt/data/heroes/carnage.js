var symbiot_base = implement("pwt:external/symbiot_base");

var TAG = "BladeType";

var Arsenal = {
    "Axe": "axe",
    "Sword": "sword"
};

function getBladeType(entity) {
    return entity.getWornChestplate().nbt().getByte("BladeType") | 0;
}

function init(hero) {
    hero.setName("Carnage");
	hero.setVersion("Sony-Verse");
	
    hero.setChestplate("Symbiote");

    hero.addPowers("pwt:symbiot_carnage")
	
	hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 25.0, 0);
	hero.addAttribute("BASE_SPEED", 0.1, 1);
	hero.addAttribute("MAX_HEALTH", 3.0, 0);
	hero.addAttribute("SPRINT_SPEED", 0.60, 1);
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
	
	hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
	hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
	hero.addKeyBindFunc("func_CYCLE_BLADE", cycleWeaponKey,"Cycle Blades", 3);
	Object.keys(Arsenal).forEach((key, index) => {
        hero.addKeyBindFunc("func_BLADE_" + index, toggleBladeKey,  "Toggle " + key, 4);
    });
    hero.addKeyBind("TENTACLES", "key.tentacles", 5);

	hero.setDamageProfile(getProfile);
	
	hero.addAttributeProfile("AXE", axeProfile);
	hero.addAttributeProfile("SWORD", swordProfile);
	
	hero.addDamageProfile("AXE", {"types": {"SHARP": 0.7, "BLUNT": 0.3}});
	hero.addDamageProfile("SWORD", {"types": {"SHARP": 1.0}});
	
	symbiot_base.init(hero);

	hero.setAttributeProfile(getProfile);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler(tickHandler); 

}

function tickHandler(entity, manager) {
	var symbiot = entity.getData('pwt:dyn/symbiot');
	var nbt = entity.getWornChestplate().nbt();
	var weapon = getBladeType(entity);
	
	if (nbt.getBoolean("SelectCooldown")) {
		manager.setBoolean(nbt, "SelectCooldown", false);
	}
	///Object.keys(Arsenal).forEach((key, index) => {
	///	manager.incrementData(entity, ("pwt:dyn/"+Arsenal[key]+"_timer").toString(), 10, 10, entity.getData('fiskheroes:blade') && weapon == index);
	///});
	
	manager.incrementData(entity, "pwt:dyn/axe_timer", 10, 10, entity.getData('fiskheroes:blade') && weapon == 0);
	manager.incrementData(entity, "pwt:dyn/sword_timer", 10, 10, entity.getData('fiskheroes:blade') && weapon == 1);
	
	return symbiot_base.tickHandler(entity, manager);
}

function cycleWeaponKey(player, manager) {
	var weapon = getBladeType(player);
	var nbt = player.getWornChestplate().nbt();
	manager.setBoolean(nbt, "SelectCooldown", true);
	manager.setByte(nbt, 'BladeType', weapon == (Object.keys(Arsenal).length)-1 ? 0 : weapon + 1 );
	player.playSound("pwt:suit.carnage.climb", player.getData('fiskheroes:blade') ? 1.0 : 0, (0.85 + Math.random() * 0.3));
    return true;
}

function toggleBladeKey(player, manager) {
    var weapon = player.getData('fiskheroes:blade');
	manager.setDataWithNotify(player, 'fiskheroes:blade', !weapon);
    return true;
}

function axeProfile(profile) {
	profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
	profile.addAttribute("KNOCKBACK", 1.0, 0);
}

function swordProfile(profile) {
	profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
	profile.addAttribute("REACH_DISTANCE", 0.5, 0);
}

function getProfile(entity) {
	var weapon = getBladeType(entity);
	
	if (entity.getData("fiskheroes:blade")) {
		if (weapon == 0)  {
			return "AXE";
		}
		else if (weapon == 1)  {
			return "SWORD";
		}
	}
    return symbiot_base.getProfile(entity);
}

function isKeyBindEnabled(entity, keyBind) {
	var weapon = getBladeType(entity);
	var canWebSwing = entity.getWornChestplate().nbt().getBoolean("WEBSWINGING")
	
	if (keyBind == "func_GIANT_MODE") {
        return entity.getData("fiskheroes:mask_open_timer") == 0 && (!entity.getData('pwt:dyn/symbiot') || (entity.getData('pwt:dyn/symbiot') && entity.isSneaking()) );
    }
    else if (!entity.getData("pwt:dyn/symbiot")) {
        return false;
    }
	
	if (entity.getData("pwt:dyn/symbiot") && keyBind.startsWith("func_BLADE_")) {
        return !entity.getWornChestplate().nbt().getBoolean("SelectCooldown") && keyBind == ("func_BLADE_" + weapon);
    }
	switch (keyBind) {
		
	case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() && canWebSwing && !entity.isSneaking();
	case "func_CYCLE_BLADE":
        return (canWebSwing && entity.isSneaking()) || !canWebSwing;
	}

	return symbiot_base.isKeyBindEnabled(entity, keyBind);
}