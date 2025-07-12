function init(hero) {
    hero.setName("Loki (Thor Ragnarok)"); 
    hero.setTier(7); 
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece"); 
    
    hero.addPowers("emo:loki"); 
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0); 
    hero.addAttribute("WEAPON_DAMAGE", 5.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    
    hero.addKeyBind("ENERGY_PROJECTION", "Energy Projection", 1);
    hero.addKeyBind("SPELL_MENU", "Loki Spells", 2);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 3);
    hero.addKeyBind("TELEPORT", "Teleport", 4);
}