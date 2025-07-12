function init(hero) {
    hero.setName("Red Hulk");
    hero.setTier(8);
    
    hero.setChestplate("Suit");
       
    hero.addPowers("emo:gamma", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("JUMP_HEIGHT", 6.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 4.0, 0);
    
    hero.addKeyBind("CHARGED_BEAM", "Thunder Clap", 1);
    hero.addKeyBind("EARTHQUAKE", "Earth Quake", 2);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 3);
	
    hero.setDefaultScale(2.0);
}