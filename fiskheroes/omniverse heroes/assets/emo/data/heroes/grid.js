function init(hero) {
    hero.setName("Grid");
    hero.setTier(6);
    
    hero.setChestplate("armor");
    
    hero.addPowers("emo:grid");
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.3, 1);
    
    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("HEAT_VISION", "Lazer", 2);
    hero.addKeyBind("BLADE", "Blade", 3);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 4);
    
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ATLANTEAN_STEEL": 1.0
        }
    });
    
    hero.addSoundEvent("STEP", "fiskheroes:manta_walk");

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9.5, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}