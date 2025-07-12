function init(hero) {
    hero.setName("Red Death");
    hero.setTier(7);
    
    hero.setChestplate("armor");
    hero.addPrimaryEquipment("fiskheroes:flash_ring", true);
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("emo:red");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 9.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 8.0, 0);

    hero.addKeyBind("SUPER_SPEED", "Super Speed", 1);
    hero.addKeyBind("SLOW_MOTION", "Slow Motion", 2);
    hero.addKeyBind("SPELL_MENU", "Clones", 3);
    hero.addKeyBind("SENTRY_MODE", "Sentry Mode", 4);

    hero.setDefaultScale(1.2);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("SPEED_PUNCH", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 5
        }
    });
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : null;
}
