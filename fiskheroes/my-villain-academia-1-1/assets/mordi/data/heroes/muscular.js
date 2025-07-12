function init(hero) {
    hero.setName("Muscular");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("mordi:muscular_increase", "mordi:geokinesis");
    hero.addAttribute("MAX_HEALTH", 21.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 17.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    hero.addKeyBind("EARTHQUAKE", "Earthquake", 1);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 2);
    hero.addKeyBind("SIZE_MANIPULATION", "Muscle Increase", 3);

    hero.setDefaultScale(1.5);
}
