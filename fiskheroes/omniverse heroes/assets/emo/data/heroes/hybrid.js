var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Kryptomartian (Kryptonian And Martian Hybrid)");
    hero.setTier(9);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
       
    hero.addPowers("emo:hybrid", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 14.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 5.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 4.0, 0);
    
    hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
    hero.addKeyBind("CHARGED_BEAM", "freeze breath", 2);
	hero.addKeyBind("TELEKINESIS", "Martian telekinesis", 3);
    hero.addKeyBind("INTANGIBILITY", "Intangibility and Invisibility", 4);
    hero.addKeyBind("INVISIBILITY", "Intangibility and Invisibility", 4);
    hero.addKeyBind("SUPER_SPEED", "speed", 5);
	
    hero.setDefaultScale(1.2);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}