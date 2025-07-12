var symbiot_base = implement("pwt:external/symbiot_base");
function init(hero) {
    hero.setName("Venom");
	hero.setVersion("Sony-Verse");
	
    hero.setChestplate("Symbiote");

    hero.addPowers("pwt:symbiot_venom")
	
	hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 20.0, 0);
	hero.addAttribute("SPRINT_SPEED", 0.55, 1);
	hero.addAttribute("STEP_HEIGHT", 0.5, 0);
	
	hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
	hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
    hero.addKeyBind("TENTACLES", "key.tentacles", 5);
	
	symbiot_base.init(hero);
	hero.setTickHandler(tickHandler); 
}

function tickHandler(entity, manager) {
	var symbiot = entity.getData('pwt:dyn/symbiot');
	manager.incrementData(entity, "pwt:dyn/cooldown_interp_1", 10, 30, (entity.loop(1200)*entity.getData('pwt:dyn/symbiot_timer'))>=0.98 && entity.motion().length() < 0.1 && entity.getData('fiskheroes:mask_open_timer2')==0);
	manager.incrementData(entity, "pwt:dyn/cooldown_interp_2", 5, 10, (entity.loop(3000)*entity.getData('pwt:dyn/symbiot_timer'))>=0.96 );
	return symbiot_base.tickHandler(entity, manager);
}