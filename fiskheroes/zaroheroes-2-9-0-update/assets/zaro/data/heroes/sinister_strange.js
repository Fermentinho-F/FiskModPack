function init(hero) {
    hero.setName("Sinister Strange");
    hero.setTier(7);

    hero.setChestplate("item.superhero_armor.piece.robes");
   
    hero.addPowers("zaro:darkhold_magic");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("ENERGY_PROJECTION", "energy projection", 1);
    hero.addKeyBind("SHIELD", "key.shield", 1);
    hero.addKeyBind("SPELL_MENU", "Spell Menu", 2);
    hero.addKeyBind("TELEPORT", "Teleport", 3);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 4);
    hero.addKeyBind("BLADE", "key.blade", 5);
    
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
    profile.addAttribute("PUNCH_DAMAGE", 25.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}


function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:shield" || !entity.getData("fiskheroes:energy_projection");
}

function isKeyBindEnabled(entity, keyBind) {   
    switch (keyBind) {
    case "SHIELD":
        return !entity.getData("fiskheroes:shield") || !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming"));
    case "ENERGY_PROJECTION":
        return entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:energy_projection") || entity.isBookPlayer();
    case "SPELL_MENU":
        return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:shield");
        
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:shield_blocking_timer") == 0;
}

