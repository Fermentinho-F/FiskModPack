function init(hero) {
    hero.setName("Exo Suit Black");
    hero.setTier(9);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
       
    hero.addPowers("fiskheroes:super_speed", "emo:exo", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 1.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 4.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.7, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);

    hero.addKeyBind("TELEKINESIS", "telekinesis", 1);
    hero.addKeyBind("AIM", "telekinesis", 1);
    hero.addKeyBind("TELEPORT", "teleport", 2);
    hero.addKeyBind("SUPER_SPEED", "speed", 3);
    hero.addKeyBind("INVISIBILITY", "invisibility", 4);
    hero.addKeyBind("SPELL_MENU", "Exo illusion", 5);
    
    hero.setDefaultScale(1.1);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:grab_id") > -1;
}
