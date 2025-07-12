function init(hero) {
    hero.setName("Cloak Of Mystical");
    hero.setTier(3);
    
    hero.setChestplate("Powers");
    
    hero.addPowers("emo:magic");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 300.5, 0);
    
    hero.addKeyBind("BLADE", "key.blade", 1);
    hero.addKeyBind("AIM", "Magical Fire", 2);
    hero.addKeyBind("SHIELD", "key.shield", 3);
    hero.addKeyBind("SPELL_MENU", "key.spellMenu", 4);
    hero.addKeyBind("SENTRY_MODE", "Go Cloak", 5);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "FIRE": 0.2
        }
    });

    hero.setTickHandler((entity, manager) => {
        if (!entity.isSneaking() && !entity.isOnGround() && entity.motionY() < -0.8) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:shield" || !entity.getData("fiskheroes:blade");
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SPELL_MENU":
        return !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}