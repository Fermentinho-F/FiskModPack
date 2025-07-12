function init(hero) {
    hero.setName("The Immortal");
    hero.setVersion("Invincible");
    hero.setAliases("lincon");
    hero.setTier(8);
    
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:enhanced_human_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 11.6, 0);
    hero.addAttribute("SPRINT_SPEED", 0.38, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("WEAPON_DAMAGE", -0.25, 1);

    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);

    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}
