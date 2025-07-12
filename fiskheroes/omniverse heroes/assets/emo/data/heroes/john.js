function init(hero) {
    hero.setName("John Constantine");
    hero.setTier(3);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("emo:constantine");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 300.5, 0);
    
    hero.addKeyBind("SPELL_MENU", "Spell Menu", 1);
    hero.addKeyBind("SHIELD", "Shield", 2);
    hero.addKeyBind("BLADE", "Hell Energy Mod", 3);
    hero.addKeyBind("AIM", "Hell Fire", 4);
    hero.addKeyBind("CHARGED_BEAM", "Hell Fire Blast", 5);
    
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
    profile.addAttribute("PUNCH_DAMAGE", 12.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("fiskheroes:blade");    
    default:
        return true;
    }
}


function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SPELL_MENU":
        return !entity.getData("fiskheroes:shield");
    case "AIM":
        return entity.getData("fiskheroes:blade");
    case "CHARGED_BEAM":
        return entity.getData("fiskheroes:blade");
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}