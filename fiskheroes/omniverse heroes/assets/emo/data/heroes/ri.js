function init(hero) {
    hero.setName("Interia");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:flash_ring", true);
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("emo:speed_force");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 1.5, 1);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("SPELL_MENU", "clones", 3);
    
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

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
