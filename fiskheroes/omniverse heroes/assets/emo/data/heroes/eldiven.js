function init(hero) {
    hero.setName("Infinity gauntlet");
    hero.setTier(10);
    
    hero.setChestplate("and powers");
    
    hero.addPowers("fiskheroes:vibranium_physiology", "emo:stones");
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 400.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 4.0, 0);

    hero.addKeyBind("CHARGED_BEAM", "Power Stone Blast and Telekinesis", 1);
    hero.addKeyBind("TELEKINESIS", "Power Stone Blast and Telekinesis", 1);
    hero.addKeyBind("SUPER_SPEED", "Time Stone Speed", 2);
    hero.addKeyBind("TELEPORT", "Teleport", 3);
    hero.addKeyBind("SPELL_MENU", "Time Stone Spell Menu", 4);
    hero.addKeyBind("SHADOWDOME", "Shadow Dome", 5);

    hero.supplyFunction("canAim", canAim);
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
