function init(hero) {
    hero.setName("Twice");
    hero.setAliases("Jin Bubaigawara");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");
    hero.addPrimaryEquipment("fiskheroes:bo_staff", true);
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true)

    hero.addPowers("mordi:twice_clonation");

    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 5.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);

    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");

    hero.addKeyBind("SPELL_MENU", "Auto Clonation", 1);
	
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close")
}
