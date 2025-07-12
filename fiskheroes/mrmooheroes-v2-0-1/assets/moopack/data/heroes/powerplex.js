function init(hero) {
    hero.setName("Powerplex/Scott Duvall");
    hero.setAliases("bl");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("moopack:powersuit_electrokinesis");
    hero.addPowers("moopack:electricity_resistance");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Energy Beam", 1);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
}