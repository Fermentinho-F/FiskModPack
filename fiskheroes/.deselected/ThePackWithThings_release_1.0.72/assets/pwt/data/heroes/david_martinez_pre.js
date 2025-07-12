var ban = implement("pwt:external/switch");
function init(hero) {
    hero.setName("David Martinez");
    hero.setTier(2);
	
    hero.setChestplate("Jacket");
    hero.setLeggings("Jogging");
    hero.setBoots("Sneakers");
	
	hero.addPowers("pwt:sandevistan");
	hero.addPrimaryEquipment("fiskheroes:beretta_93r", true);
	
	hero.addAttribute("SPRINT_SPEED", 0.2, 1);
	
	hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
	hero.addKeyBind("SANDEVISTAN", "Sandevistan", 2);
	hero.addKeyBind("SUPER_SPEED", "Sandevistan", 2);
		
	hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setModifierEnabled(isModifierEnabled);
	hero.setRuleValueModifier(ruleModifier);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun() || entity.getHeldItem().name() == "fisktag:weapon");
	
	hero.addAttributeProfile("SANDEVISTAN", sandevistanProfile);
	hero.addAttributeProfile("PUNISHMENT", punishProfile);
    hero.setAttributeProfile(getProfile);
	hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SANDEVISTAN", {
            "types": {
                "BLUNT": 1.0
            },
            "properties": {
                "HIT_COOLDOWN": 7
            }
    });
	
	hero.setTickHandler((entity, manager) => {
		var ability = entity.getDataOrDefault('pwt:dyn/ability', false);
		
		manager.setData(entity, 'fiskheroes:speeding', ability);
		manager.setData(entity, 'fiskheroes:slow_motion', ability);
		
		if (ability) {
			manager.setData(entity, 'fiskheroes:reload_timer', entity.getData('fiskheroes:reload_timer')*1.5);
			manager.setData(entity, 'fiskheroes:gun_shooting_timer', entity.getData('fiskheroes:gun_shooting_timer')*1.5);
			if (entity.getData('fiskheroes:aiming')) {
				manager.setData(entity, 'fiskheroes:aiming_timer', Math.min(entity.getData('fiskheroes:aiming_timer')*1.5, 1));
			}
		}
		manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && ability);
		ban.tick(entity, manager);
	});
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
	case "GUN_RELOAD":
		return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
	case "SUPER_SPEED":
		return !entity.getData('pwt:dyn/ability') && entity.getData("pwt:dyn/ability_cooldown")>0;
	case "SANDEVISTAN":
		return !(!entity.getData('pwt:dyn/ability') && entity.getData("pwt:dyn/ability_cooldown")>0);
	default:
		return true;
    }
}

function isModifierEnabled(entity, modifier) {	
	var hash = entity.getWornChestplate().nbt().getInteger("Upgrades");
	var sprint_upgrade = hash >> 4 * 5 & 0xF;
	switch (modifier.name()) {
	case "fiskheroes:cooldown":
		return modifier.id() == 'cooldown_sandevistan_upgrade_'+sprint_upgrade;
	default:
		return true;
	}
}


function ruleModifier(entity, rule) {
	
	if (rule.name() == "fiskheroes:cooldown_deserteagle") {
		return rule.value() - rule.value()*0.4*entity.getData('pwt:dyn/ability_timer')
	}
	else if (rule.name() == "fiskheroes:cooldown_beretta93r") {
		return rule.value() - rule.value()*0.8*entity.getData('pwt:dyn/ability_timer')
	}
    return null;
}

function getProfile(entity) {
	if (entity.getData('pwt:dyn/punishment')) {
        return "PUNISHMENT";
    }
    return entity.getData('pwt:dyn/ability') ? "SANDEVISTAN" : null;
}

function sandevistanProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("BASE_SPEED_LEVELS", 2, 0);
	profile.addAttribute("JUMP_HEIGHT", 1.1, 0);
	profile.addAttribute("BASE_SPEED", 0.65, 1);
	profile.addAttribute("SPRINT_SPEED", -0.1, 1);
	profile.addAttribute("KNOCKBACK", 1.0, 0);
	profile.addAttribute("PUNCH_DAMAGE", 3.5, 0);
	profile.addAttribute("STEP_HEIGHT", 1.5, 0);
}
function punishProfile(profile) {
    profile.revokeAugments();
	profile.addAttribute("MAX_HEALTH", -10000000.0, 0);

}