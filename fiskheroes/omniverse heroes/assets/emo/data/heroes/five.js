function init(hero) {
    hero.setName("Five Hargreeves");
    hero.setTier(1);
    
    hero.setChestplate("item.superhero_armor.piece.trenchcoat");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("minecraft:diamond_axe", true);
    
    hero.addPowers("emo:five");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    
    hero.addKeyBind("TELEPORT", "Teleport", 1);

    hero.setDefaultScale(0.8);
}