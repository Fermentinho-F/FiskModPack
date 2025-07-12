var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Phantom Girl (Young Justice)");
    hero.setTier(3);
    
    hero.setChestplate("suit");
       
    hero.addPowers("emo:phantom");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    
    hero.addKeyBind("INTANGIBILITY", "Intangibility", 1);
	
    hero.setDefaultScale(1.2);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}