function init(hero) {
    hero.setName("Wonder Girl (Young Justice)");
    hero.setTier(6);
    
    hero.setChestplate("Suit");
       
    hero.addPowers("emo:wonder");
    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("JUMP_HEIGHT", 7.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    
    hero.addKeyBind("EARTHQUAKE", "Earth Quake", 1);
    hero.addKeyBind("SUPER_SPEED", "speed", 2);
    hero.addKeyBind("SLOW_MOTION", "slow time", 3);
}
