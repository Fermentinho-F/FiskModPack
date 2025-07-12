function init(hero) {
    hero.setName("Cosmic Ghost Rider");
    hero.setTier(9);
    
    hero.setChestplate("head");
    
    hero.addPowers("emo:rider");
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
	hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 11000.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 9.0, 0);
    hero.addAttribute("SPRINT_SPEED", 3.10, 1);
    
    hero.addKeyBind("CHARGED_BEAM", "Penance Stare", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Hell Fire Beam", 2);
    hero.addKeyBind("AIM", "Hell Fire", 3);
    hero.addKeyBind("SHIELD", "key.forcefield", 4);
    hero.addKeyBind("SUPER_SPEED", "Bike", 5);
    
    hero.setDefaultScale(1.2);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.supplyFunction("canAim", canAim);

    hero.setDamageProfile(entity => entity.getHeldItem().isEmpty() ? "FLAME_PUNCH" : null);
    hero.addDamageProfile("FLAME_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 0.4
        },
        "properties": {
            "HEAT_TRANSFER": 40,
            "IGNITE": 2
        }
    });
    
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:flame_off");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:flame_on");
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}