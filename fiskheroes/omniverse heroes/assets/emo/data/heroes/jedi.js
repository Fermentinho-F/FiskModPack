function init(hero) {
    hero.setName("Blue Light Saber");
    hero.setTier(1);
    
    hero.setChestplate("And Force Power");
    
    hero.addPowers("emo:jedi");
    hero.addAttribute("JUMP_HEIGHT", 2.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 60.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SHIELD", "Force", 1);
    hero.addKeyBind("BLADE", "Lightsaber", 2);
    hero.addKeyBind("TELEKINESIS", "Force Telekinesis", 3);
    hero.addKeyBind("AIM", "Force Telekinesis", 3);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "COLD": 0.4
        }
    });
}


function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("KNOCKBACK", 1.5, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "BLADE":
            return entity.getData("fiskheroes:shield");
        case "TELEKINESIS":
            return entity.getData("fiskheroes:shield");
        case "AIM":
            return entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:grab_id") > -1;
}
