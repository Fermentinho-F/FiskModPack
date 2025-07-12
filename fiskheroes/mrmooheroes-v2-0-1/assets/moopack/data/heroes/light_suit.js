function init(hero) {
    hero.setName("Light Suit");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:captain_americas_shield{Electromagnetic:1,display:{Name:\"Light Disc\"}}", true);
    //hero.addPrimaryEquipment("fiskheroes:captain_americas_shield", true);

    hero.addPowers("moopack:light_suit");
    hero.addAttribute("PUNCH_DAMAGE", 3.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 6.5, 0);
    //hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);

    hero.addKeyBind("SHIELD_THROW", "Disc Throw", 1);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission(hasPermission);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
}

function isKeyBindEnabled(entity, keyBind) {
    return keyBind != "SHIELD_THROW" || entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
}

function hasPermission(entity, permission) {
    return permission == "USE_SHIELD";
}
