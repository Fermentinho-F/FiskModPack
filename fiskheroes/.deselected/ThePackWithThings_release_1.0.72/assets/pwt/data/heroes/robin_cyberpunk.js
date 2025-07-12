function init(hero) {
    hero.setName("Robin");
	hero.setVersion("Cyberpunk");
    hero.setTier(5);
	
	hero.setHelmet("Mask");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");
	hero.addPrimaryEquipment("fiskheroes:tactical_tonfa", true, item => !item.nbt().getBoolean("Dual"));
	hero.addPowers("pwt:robin_suit_cyberpunk", "pwt:hoverboard");

	hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
	
	hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
	hero.addKeyBindFunc("GAUNTLET", gauntletKey,"Equip/Unequip Gauntlets", 2);
	hero.addKeyBindFunc("WEB_SWINGING", webSwingingKey, "Toggle Grappling", 3);
	hero.addKeyBind("HOVERBOARD", "Call Hoverboard", 5);
	
	hero.setDefaultScale(0.95);
	hero.setHasProperty(hasProperty);
	hero.setModifierEnabled(isModifierEnabled);
	hero.setKeyBindEnabled(isKeyBindEnabled);
	
	hero.setTickHandler((entity, manager) => {
		var hover = false;
		if (entity.getData('pwt:dyn/dash') && entity.isSneaking() && entity.isOnGround()) {
			manager.setData(entity, 'pwt:dyn/dash', false);
		}
		if (entity.getData('pwt:dyn/dash_timer') == 1) {
			if (!entity.isSneaking() && (entity.isOnGround() || !entity.world().blockAt(entity.pos().add(0, -3, 0)).isEmpty())) {
				manager.setDataWithNotify(entity, 'fiskheroes:shadowform', true);
			}
			for (var i = 0; i < 6; i++) {
				if (!entity.world().blockAt(entity.pos().add(0, -i, 0)).isEmpty()) {
					hover = true
				}
				else {
					
				}
			}
			manager.setData(entity, 'fiskheroes:flying', hover);
		}
		if (entity.getData('fiskheroes:shadowform')) {
			manager.setData(entity, 'fiskheroes:shadowform', false);
		}
		manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && entity.getData('fiskheroes:speeding'));
		});
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:gliding", false);
    }
    

    return true;
}

function gauntletKey(player, manager) {
	manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
	manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    return true;
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return true;
    default:
        return false;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
	case "fiskheroes:controlled_flight":
        return entity.getData('pwt:dyn/dash');
	case "fiskheroes:propelled_flight":
        return entity.getData('fiskheroes:flying');
	case "fiskheroes:equipment":
        return (modifier.id() == 'gauntlet_equipment' == entity.getData('pwt:dyn/web_shooters_timer') > 0.5 ) && !entity.getData('fiskheroes:flying');
    }
	return true;
}

function isKeyBindEnabled(entity, keyBind) {
	if (entity.getData('pwt:dyn/dash')) {
		return keyBind == 'HOVERBOARD' || (keyBind == "WEB_SWINGING" == entity.getHeldItem().isEmpty());
	}
	
    switch (keyBind) {
	case "WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
	}
	return true;
	
}