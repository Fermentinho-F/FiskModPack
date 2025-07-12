function init(hero) {
    hero.setName("Ghost");
    hero.setTier(1);
	
	hero.setHelmet("Bed Sheet");
	
	hero.addPowers("pwt:ghost_physiology");
	
	hero.addKeyBind("AIM", "key.aim", -1);
	hero.addKeyBind("HIDE", "Hide", 1);
	hero.addKeyBindFunc("CREEPER", creeper,'"Ksssss"', 2);
	hero.addKeyBindFunc("ENDERMAN", enderman,"Mimic Enderman", 3);
	hero.addKeyBindFunc("POP", pop,'"POP"', 4);
	
	hero.addAttribute("PUNCH_DAMAGE", -1.0, 1);
	hero.addAttribute("WEAPON_DAMAGE", -1.0, 1);
	
	hero.setTierOverride(entity => 0);
	
	
	hero.setTickHandler((entity, manager) => {
		manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() );
		manager.setData(entity, "fiskheroes:invisible", entity.getData('pwt:dyn/power_timer') == 1);
		manager.setData(entity, "fiskheroes:flying", true);
		manager.setData(entity, "fiskheroes:intangible", true);
	});
}

function creeper(player, manager) {
	player.playSound("minecraft:creeper.primed", 1.0, (0.9 + Math.random() * 0.1));
    return true;
}
	
function enderman(player, manager) {
	player.playSound("minecraft:mob.endermen.stare", 1.0, (0.9 + Math.random() * 0.1));
    return true;
}

function pop(player, manager) {
	if (player.getData('pwt:dyn/power_timer') < 1) {
		manager.setData(player, 'pwt:dyn/powered', false);
		manager.setData(player, 'pwt:dyn/power_timer', 0);
	}
	player.playSound("minecraft:random.pop", 1.0, (0.7 + Math.random() * 0.3));
    return true;
}		
