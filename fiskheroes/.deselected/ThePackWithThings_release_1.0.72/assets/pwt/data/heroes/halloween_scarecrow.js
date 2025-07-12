function init(hero) {
    hero.setName("Bob");
	hero.setTier(2);
	
    hero.setHelmet("Pumpkin");
	hero.addPrimaryEquipment("fisktag:weapon{WeaponType:pwt:scythe, AttributeModifiers:[{Operation:0,UUIDLeast:1,UUIDMost:1,Amount:5.5,AttributeName:generic.attackDamage,Name:Attack Damage}]}", true, item => item.nbt().getString("WeaponType") == 'pwt:scythe');
	
	hero.addPowers("pwt:scarecrow_physiology");
	
	hero.addAttribute("PUNCH_DAMAGE", -1.0, 1);
	hero.addAttribute("WEAPON_DAMAGE", -1.0, 1);
	hero.addAttribute("BASE_SPEED", -100.0, 1);
	hero.addAttribute("SPRINT_SPEED", -100.0, 1);
	hero.addAttribute("JUMP_HEIGHT", -100.0, 1);
	
	///hero.setDefaultScale(2.0);
	hero.setAttributeProfile(getProfile);
	hero.addAttributeProfile("REAPER", reaperProfile);
	
	hero.setTickHandler((entity, manager) => {
		manager.setData(entity, 'pwt:dyn/powered', (entity.getHeldItem().name() != 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') != "pwt:scythe"));
		manager.setData(entity, 'fiskheroes:scale', 2);
		
		if (entity.isBurning()) {
			manager.setData(entity, 'pwt:dyn/fire_cooldown', 1);
		}
		else{
			manager.setData(entity, 'pwt:dyn/fire_cooldown', 0);
		}
		if (entity.getData('pwt:dyn/fire_timer') > 0) {
			manager.setData(entity, 'pwt:dyn/powered', false);
		}
		
		manager.incrementData(entity, 'pwt:dyn/fire_timer', 0, 5000, entity.getDataOrDefault('pwt:dyn/fire_cooldown', 0) == 1)
		
		manager.setData(entity, 'fiskheroes:disguise', "Bob");
		manager.setData(entity, 'fiskheroes:shape_shifting', true);
		manager.incrementData(entity, "pwt:dyn/idle_timer", 5, entity.getData('fiskheroes:moving'));
	});
}

function getProfile(entity) {
	if (!entity.getData('pwt:dyn/powered')) {
		return "REAPER";
	}
    return null;
}

function reaperProfile(profile) {
	profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
	profile.addAttribute("SPRINT_SPEED", 0.25, 1);
	profile.addAttribute("KNOCKBACK", 3.0, 0);
	profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
	profile.addAttribute("WEAPON_DAMAGE", 6.5, 0);
	profile.addAttribute("STEP_HEIGHT", 1.5, 0);
	profile.addAttribute("REACH_DISTANCE", 1.3, 0);
}
