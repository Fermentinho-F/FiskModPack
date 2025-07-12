function init(hero) {
    hero.setName("Power");
    hero.setTier(5);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("emo:power");
    hero.addAttribute("JUMP_HEIGHT", 3.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("FALL_RESISTANCE", 9000.5, 0);

    hero.addKeyBind("SHIELD", "Blood Hammer", 1);
    hero.addKeyBind("BLADE", "Blood Blade", 2);
    hero.addKeyBind("GROUND_SMASH", "Ground Smash", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "COLD": 0.4
        }
    });
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
    profile.addAttribute("KNOCKBACK", 6.5, 0);
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" :  entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
            case "fiskheroes:blade":
                return entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:aiming") && !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
            case "fiskheroes:shield":
                return entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:aiming") && !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade"));
        default:
            return true;
        }    
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "GROUND_SMASH":
            return entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}