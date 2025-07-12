var ban = implement("pwt:external/switch");
var landing = implement("pwt:external/superhero_landing_noflight");
function init(hero) {
    hero.setName("Joker");
	hero.setVersion("Cyberpunk");
    hero.setTier(7);
	
	hero.setHelmet("Head");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Cargo");
    hero.setBoots("Sneakers");
	
	hero.addPowers("pwt:joker_implant", "pwt:venom_injection");
	hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
	
	hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.65, 1);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
	
	hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
	hero.addKeyBind("REAPER_SCYTHE", "Toggle Reaper Scythe", 1);
	hero.addKeyBind("ENERGY_PROJECTION", "Toggle Reaper Scythe", 1);
	hero.addKeyBindFunc("REAPER_OVERHEAT_1", empty, "\u00A76Overheat...", 1);
	hero.addKeyBindFunc("REAPER_OVERHEAT_2", empty, "Overheat...", 1);
	
	hero.addKeyBind("SANDEVISTAN", "Sandevistan", 2);
	hero.addKeyBind("SUPER_SPEED", "Sandevistan", 2);
	hero.addKeyBind("VENOM", "Inject Venom", 3);
	hero.addKeyBindFunc("VENOM_FULL", empty, "\u00A72Full Capacity", 3);
	hero.addKeyBindFunc("VENOM_REFILL_1", empty, "\u00A72Refilling...", 3);
	hero.addKeyBindFunc("VENOM_REFILL_2", empty, "Refilling...", 3);
	hero.addKeyBind("MANTIS_BLADE", "Mantis Blade", 4);
		
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setModifierEnabled(isModifierEnabled);
	hero.setRuleValueModifier(ruleModifier);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
	
	hero.addAttributeProfile("SANDEVISTAN", sandevistanProfile);
	hero.addAttributeProfile("MANTIS_BLADE", mantisProfile);
	hero.addAttributeProfile("MANTIS_BLADE_SANDEVISTAN", mantisSandevistanProfile);
	hero.addAttributeProfile("PUNISHMENT", punishProfile);
	hero.addAttributeProfile("LANDING", landingProfile);
	hero.setDefaultScale(1.05);
	///hero.setDefaultScale((entity) => Math.min((1.05 + 0.2*entity.getData('pwt:dyn/charge')), 1.4));
    hero.setAttributeProfile(getProfile);
	hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SANDEVISTAN", {"types": {"BLUNT": 1.0}, "properties": {
		"HIT_COOLDOWN": 7
            }
    });
	hero.addDamageProfile("MANTIS_BLADE", {"types": {"SHARP": 0.8, "BLUNT": 0.2}, "properties": {
		"HIT_COOLDOWN": 15.0		
			} 
	});
	hero.addDamageProfile("MANTIS_BLADE_SANDEVISTAN", {"types": {"SHARP": 0.8, "BLUNT": 0.2}, "properties": {
		"HIT_COOLDOWN": 8.5		
			} 
	});
	
	hero.setTickHandler((entity, manager) => {
		var ability = entity.getDataOrDefault('pwt:dyn/ability', false);
		
		manager.setData(entity, 'fiskheroes:speeding', ability);
		manager.setData(entity, 'fiskheroes:slow_motion', ability);
		
		if (entity.getData('pwt:dyn/powered')) {
			manager.setData(entity, 'pwt:dyn/charge', Math.min((entity.getData('pwt:dyn/charge') + 0.002), 1.0));
		}
		
		if (ability) {
			manager.setData(entity, 'fiskheroes:reload_timer', entity.getData('fiskheroes:reload_timer')*1.3);
			manager.setData(entity, 'fiskheroes:gun_shooting_timer', entity.getData('fiskheroes:gun_shooting_timer')*1.3);
			if (entity.getData('fiskheroes:aiming')) {
				manager.setData(entity, 'fiskheroes:aiming_timer', Math.min(entity.getData('fiskheroes:aiming_timer')*1.3, 1));
			}
			if (entity.getData('pwt:dyn/crab_cannon')) {
			manager.setData(entity, 'pwt:dyn/crab_cannon_timer', Math.min(entity.getData('pwt:dyn/crab_cannon_timer')*1.3, 1));
			}
		}
		
		if (entity.getData('pwt:dyn/sword')) {
			manager.setData(entity, 'fiskheroes:blade', true);
		}
		if (entity.isPunching() && entity.getPunchTimer()==0.0 && entity.getData('pwt:dyn/sword')) {
			manager.setData(entity, 'pwt:dyn/counter', entity.getData('pwt:dyn/counter') == 1 ? 0 : entity.getData('pwt:dyn/counter')  + 1)
		}
		
		manager.incrementData(entity, "pwt:dyn/cooldown_5", 200, 250, entity.getData('fiskheroes:energy_projection'));
		manager.incrementData(entity, "pwt:dyn/cooldown_6", 0, 250, entity.getDataOrDefault('pwt:dyn/cooldown_5', 0) == 1);
		
		manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && ability);
		
		if (entity.getData('pwt:dyn/charge') > 0.5) {
			landing.tick(entity, manager);
		}
		
		if (entity.getData('fiskheroes:flying')) {
			manager.setData(entity, "pwt:dyn/leap_cooldown", 1);
			
		}
		if (entity.isOnGround()) {
			manager.incrementData(entity, "pwt:dyn/leap_cooldown", 1, false);
		}
		ban.tick(entity, manager);
	});
}

function empty(player, manager) {
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
	var flash_on = entity.ticksExisted() % 10 >= 0 && entity.ticksExisted() % 10 < 5;
    switch (keyBind) {
	case "GUN_RELOAD":
		return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
	case "REAPER_SCYTHE":
		return entity.getHeldItem().isEmpty() && entity.getData('pwt:dyn/cooldown_6') == 0;
	case "SUPER_SPEED":
		return !entity.getData('pwt:dyn/ability') && entity.getData("pwt:dyn/ability_cooldown")>0;
	case "ENERGY_PROJECTION":
		return entity.getData('pwt:dyn/crab_cannon_timer')==1;
	case "SANDEVISTAN":
		return !(!entity.getData('pwt:dyn/ability') && entity.getData("pwt:dyn/ability_cooldown")>0);
		
	case "VENOM":
		return (entity.getData('pwt:dyn/power_cooldown') == 0 || entity.getData('pwt:dyn/powered')) && entity.getData('pwt:dyn/charge') < 1 && !(entity.getData('fiskheroes:time_since_damaged') > 0 && entity.getData('fiskheroes:time_since_damaged')<25);
	
	case "VENOM_FULL":
		return entity.getData('pwt:dyn/charge') >= 0.99;
	case "VENOM_REFILL_1":
		return entity.getData('pwt:dyn/power_cooldown') != 0 && !entity.getData('pwt:dyn/powered') && !flash_on;
	case "VENOM_REFILL_2":
		return entity.getData('pwt:dyn/power_cooldown') != 0 && !entity.getData('pwt:dyn/powered') && flash_on;
	case "REAPER_OVERHEAT_1":
		return entity.getData('pwt:dyn/cooldown_6') > 0 && !flash_on;	
	case "REAPER_OVERHEAT_2":
		return entity.getData('pwt:dyn/cooldown_6') > 0 && flash_on;
	
	default:
		return true;
    }
}


function isModifierEnabled(entity, modifier) {
	var nbt = entity.getWornChestplate().nbt();
	
    switch (modifier.name()) {
	case "fiskheroes:energy_projection":
        return entity.getData('pwt:dyn/crab_cannon') && entity.getData('pwt:dyn/cooldown_6') == 0;
	case "fiskheroes:blade":
        return entity.getData('pwt:dyn/sword');
	case "fiskheroes:potion_immunity":
        return entity.getData('pwt:dyn/charge') >0.7;
	case "fiskheroes:leaping":
        return entity.getData('pwt:dyn/charge') > 0.5;
	case "fiskheroes:regeneration":
        return entity.getData('pwt:dyn/powered');
		
	case "fiskheroes:controlled_flight":
        return entity.getData('pwt:dyn/leap_cooldown') == 0.0;
	case "fiskheroes:flight":
        return entity.getData('fiskheroes:flying');
    }
	return true;
}


function ruleModifier(entity, rule) {
	
	if (rule.name() == "fiskheroes:cooldown_deserteagle" || rule.name() == "fiskheroes:cooldown_beretta93r") {
		return rule.value() - rule.value()*0.3*entity.getData('pwt:dyn/ability_timer')
	}
	else if (rule.name() == "fiskheroes:recoil_deserteagle" || rule.name() == "fiskheroes:recoil_beretta93r") {
		return rule.value() - rule.value()*0.2*entity.getData('pwt:dyn/charge');
	}
    return null;
}

function getProfile(entity) {
	var blade = entity.getData('fiskheroes:blade');
	if (entity.getData('pwt:dyn/punishment')) {
        return "PUNISHMENT";
    }
	if (entity.getData('fiskheroes:dyn/superhero_landing_timer')>0){
		return "LANDING";
	}
	
	if (entity.getData('pwt:dyn/ability') && !blade) {
        return "SANDEVISTAN";
    }
	else if (entity.getData('fiskheroes:blade') && !entity.getData('pwt:dyn/ability')) {
		return "MANTIS_BLADE";
	}
	else if (entity.getData('fiskheroes:blade') && entity.getData('pwt:dyn/ability')) {
		return "MANTIS_BLADE_SANDEVISTAN";
	}
    return null;
}

function sandevistanProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("BASE_SPEED_LEVELS", 1, 0);
	profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
	profile.addAttribute("BASE_SPEED", 0.95, 1);
	profile.addAttribute("SPRINT_SPEED", -0.1, 1);
	profile.addAttribute("KNOCKBACK", 1.0, 0);
	profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
	profile.addAttribute("WEAPON_DAMAGE", 5.5, 0);
	profile.addAttribute("STEP_HEIGHT", 1.5, 0);
}

function mantisProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
	profile.addAttribute("REACH_DISTANCE", 1.45, 0);
}

function mantisSandevistanProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("BASE_SPEED_LEVELS", 1, 0);
	profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
	profile.addAttribute("BASE_SPEED", 0.90, 1);
	profile.addAttribute("SPRINT_SPEED", -0.1, 1);
	profile.addAttribute("KNOCKBACK", 1.0, 0);
	profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
	profile.addAttribute("REACH_DISTANCE", 1.7, 0);
	profile.addAttribute("STEP_HEIGHT", 1.5, 0);
}

function landingProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("BASE_SPEED", -10.0, 1);
	profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
}

function punishProfile(profile) {
    profile.revokeAugments();
	profile.addAttribute("MAX_HEALTH", -10000000.0, 0);

}