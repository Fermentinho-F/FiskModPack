function init(hero) {
    hero.setName("Spinner");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:katana{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("mordi:hero_killer", "mordi:spinner_physiology")
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 100.0, 1);
    hero.addAttribute("SPRINT_SPEED", 1.0, 1);

    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);

    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");

    hero.setDefaultScale(0.90);
}
