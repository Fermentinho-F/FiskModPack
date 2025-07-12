function init(hero) {
    hero.setName("Nomu/\u00A75\u00A7lStrong Nomu\u00A7r");
    hero.setTier(9);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("mordi:nomu_psycology", "mordi:super_regeneration")
    hero.addAttribute("MAX_HEALTH", 40.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 22.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 100.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);

    hero.setDefaultScale(1.65);
}