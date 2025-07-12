function init(hero) {
    hero.setName("Fire Of Darkness");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("emo:dark");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.3, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 30.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    
    hero.addKeyBind("AIM", "Fire", 1);
    hero.addKeyBind("SUPER_SPEED", "speed", 2);
	hero.addKeyBind("SLOW_MOTION", "slow time", 3);
    
    hero.supplyFunction("canAim", canAim);

    hero.setDamageProfile(entity => entity.getHeldItem().isEmpty() ? "FLAME_PUNCH" : null);
    hero.addDamageProfile("FLAME_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 0.5
        },
        "properties": {
            "HEAT_TRANSFER": 40,
            "IGNITE": 2
        }
    });
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}