function init(hero) {
    hero.setName("Speedy/\u00A7c\u00A7lAP 1");
    hero.setTier(2);
    
    hero.setHelmet("item.superhero_armor.piece.hood");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("fiskheroes:archery");
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.7, 1);
    
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 1);
}
