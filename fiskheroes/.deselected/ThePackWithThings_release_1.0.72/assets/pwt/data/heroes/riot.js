var symbiot_base = implement("pwt:external/symbiot_base");

var TAG = "BladeType";

var Arsenal = {
    "Claws": "claws",
    "Axe": "axe",
    "Sword": "sword"
};

function getBladeType(entity) {
    return entity.getWornChestplate().nbt().getByte("BladeType") | 0;
}

function init(hero) {
    hero.setName("Riot");
	hero.setVersion("Sony-Verse");

    hero.setChestplate("Symbiote");
	///hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{Herotype:pwt:venom}", false);

    hero.addPowers("pwt:symbiot_riot")
	
	hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 23.0, 0);
	hero.addAttribute("SPRINT_SPEED", 0.7, 1);
	hero.addAttribute("STEP_HEIGHT", 0.6, 0);
	
	hero.addKeyBind("CHARGE_ICE", "Charge BioMass", 1);
	hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
	hero.addKeyBindFunc("func_CYCLE_BLADE", cycleWeaponKey,"Cycle Blades", 3);
	Object.keys(Arsenal).forEach((key, index) => {
        hero.addKeyBindFunc("func_BLADE_" + index, toggleBladeKey,  "Toggle " + key, 4);
    });
	hero.addKeyBind("THORNS", "Toggle Thorns", 5);
	
	hero.setTierOverride(getTierOverride);
	hero.setDamageProfile(getProfile);
	
	hero.addAttributeProfile("CLAWS", clawsProfile);
	hero.addAttributeProfile("AXE", axeProfile);
	hero.addAttributeProfile("SWORD", swordProfile);
	
	hero.addDamageProfile("CLAWS", {"types": {"SHARP": 1.0}, "properties": {"HIT_COOLDOWN": 8.5} });
	hero.addDamageProfile("AXE", {"types": {"SHARP": 0.6, "BLUNT": 0.4}});
	hero.addDamageProfile("SWORD", {"types": {"SHARP": 1.0}});
	
	symbiot_base.init(hero);

	hero.setAttributeProfile(getProfile);
	hero.setModifierEnabled(isModifierEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setTickHandler(tickHandler); 
}

function tickHandler(entity, manager) {
	var nbt = entity.getWornChestplate().nbt();
	var symbiot = entity.getData('pwt:dyn/symbiot');
	var weapon = getBladeType(entity);

	if (nbt.getBoolean("SelectCooldown")) {
		manager.setBoolean(nbt, "SelectCooldown", false);
	}

	manager.incrementData(entity, "pwt:dyn/cooldown_interp_1", 10, 30, ((entity.loop(800)*entity.getData('pwt:dyn/symbiot_timer'))>=0.98 && entity.motion().length() < 0.1 && entity.getData('fiskheroes:mask_open_timer2')==0));
	
	manager.incrementData(entity, "pwt:dyn/cooldown_interp_2", 5, 10, (entity.loop(1400)*entity.getData('pwt:dyn/symbiot_timer'))>=0.96 );
	
	manager.incrementData(entity, "pwt:dyn/thorns_timer", 5, 5, entity.getData('pwt:dyn/ability') && entity.isSneaking() && !entity.isPunching());
	
	manager.setDataWithNotify(entity, "fiskheroes:shield", entity.getData('pwt:dyn/thorns_timer') > 0);
	manager.setDataWithNotify(entity, "fiskheroes:shield_blocking", entity.getData('pwt:dyn/thorns_timer') > 0);
	
	///Object.keys(Arsenal).forEach((key, index) => {
	///	manager.incrementData(entity, ("pwt:dyn/"+Arsenal[key]+"_timer").toString(), 10, 10, entity.getData('fiskheroes:blade') && weapon == index);
	///});
	
	manager.incrementData(entity, "pwt:dyn/claws_timer", 10, 10, entity.getData('fiskheroes:blade') && weapon == 0);
	manager.incrementData(entity, "pwt:dyn/axe_timer", 10, 10, entity.getData('fiskheroes:blade') && weapon == 1);
	manager.incrementData(entity, "pwt:dyn/sword_timer", 10, 10, entity.getData('fiskheroes:blade') && weapon == 2);

	manager.incrementData(entity, "pwt:dyn/punch_interp", 1, 8, (entity.getData('fiskheroes:blade') && entity.isPunching() && entity.getData('pwt:dyn/punch_interp') < 1) );
	
	if (!symbiot) {
		manager.setData(entity, 'pwt:dyn/ability', false);
	}
	
	Object.keys(Arsenal).forEach((key, index) => {
		if (key.hasOwnProperty("tick")) {
			key.tick(entity, manager, weapon == index);
		}
	});

	return symbiot_base.tickHandler(entity, manager);
}

function clawsProfile(profile) {
	profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.75, 0);
	profile.addAttribute("KNOCKBACK", -2.1, 0);
}

function axeProfile(profile) {
	profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
	profile.addAttribute("KNOCKBACK", 4.0, 0);
	profile.addAttribute("REACH_DISTANCE", 1.5, 0);
	profile.addAttribute("BASE_SPEED", -0.4, 1);
}

function swordProfile(profile) {
	profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
	profile.addAttribute("REACH_DISTANCE", 0.5, 0);
	profile.addAttribute("BASE_SPEED", -0.1, 1);
}

function getProfile(entity) {
	var weapon = getBladeType(entity);
	
	if (entity.getData("fiskheroes:blade")) {
		if (weapon == 0)  {
			return "CLAWS";
		}
		else if (weapon == 1)  {
			return "AXE";
		}
		else if (weapon == 2)  {
			return "SWORD";
		}
	}
    return symbiot_base.getProfile(entity);
}

function getTierOverride(entity) {
    return entity.getData("pwt:dyn/symbiot") ? 8 : 0;
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
    var flag = player.getData("fiskheroes:blade");
    manager.setData(player, "fiskheroes:blade", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
	switch (modifier.name()) {
	case "fiskheroes:thorns":
        return entity.getData("pwt:dyn/thorns_timer")>0;
	case "fiskheroes:damage_bonus":
        return entity.getData('fiskheroes:blade');
	}
    return symbiot_base.isModifierEnabled(entity, modifier);
}

function isKeyBindEnabled(entity, keyBind) {
	var hash = entity.getWornChestplate().nbt().getInteger("Upgrades");
	var canWebSwing = entity.getWornChestplate().nbt().getBoolean("WEBSWINGING")
	
	if (keyBind == "func_GIANT_MODE") {
        return entity.getData("fiskheroes:mask_open_timer") == 0 && (!entity.getData('pwt:dyn/symbiot') || (entity.getData('pwt:dyn/symbiot') && entity.isSneaking()) );
    }
    else if (!entity.getData("pwt:dyn/symbiot")) {
        return false;
    }
	if (entity.getData("pwt:dyn/symbiot") && keyBind.startsWith("func_BLADE_")) {
        return !entity.getWornChestplate().nbt().getBoolean("SelectCooldown") && keyBind == ("func_BLADE_" + getBladeType(entity));
    }
	
    switch (keyBind) {
	case "THORNS":
        return entity.getData("pwt:dyn/symbiot_timer") == 1 && !entity.isSneaking() || entity.isBookPlayer();
	case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() && canWebSwing && !entity.isSneaking();
	case "func_CYCLE_BLADE":
        return (canWebSwing && entity.isSneaking()) || !canWebSwing;
	case "CHARGE_ICE":
        return entity.getData('fiskheroes:blade') && (hash >> 4 * 1 & 0xF) > 0;

    }
	
	return symbiot_base.isKeyBindEnabled(entity, keyBind);
}


