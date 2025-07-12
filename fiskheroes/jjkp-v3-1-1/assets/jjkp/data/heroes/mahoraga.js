var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Mahoraga/Eight-Handled Sword Divergent Sila Divine General");
    hero.setTier(7);

    hero.setHelmet("Head");
    hero.setChestplate("Body");
    hero.setLeggings("Shorts");
    hero.setBoots("Feet");

    hero.addPowers("jjkp:adaptive_physiology", "jjkp:cursed_energy");

    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("MAX_HEALTH", 11.0, 0);

    hero.setDefaultScale(2.0);

    hero.addKeyBind("BLADE", "Toggle Blade", 1);
    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 2);
    hero.addKeyBind("GROUND_SMASH", "Smash Ground", 3);

    //hero.setKeyBindEnabled(isKeyBindEnabled);
    //hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 0.5,
            "POSITIVE": 0.9
        }
    });

    hero.setTickHandler((entity, manager) => {
        var wd = entity.getData("jjkp:dyn/wheel")
        if (entity.getData("fiskheroes:time_since_damaged") <= 2) {
        manager.setData(entity, "jjkp:dyn/wheel", wd < 7 ? wd + 1 : 0);
        }
        manager.incrementData(entity, "jjkp:dyn/wheel_minus", 1, 5, entity.getData("fiskheroes:time_since_damaged")<=2);
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:charge_energy":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ENERGY":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}
/*
function isModifierEnabled(entity, modifier) {
    return entity.getHeldItem().isEmpty();
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "TENTACLE_JAB":
            return entity.getData('fiskheroes:tentacles') != null;
        case "TENTACLE_GRAB":
            return entity.getData('fiskheroes:tentacles') != null;
        default:
            return true;
        }
}*/

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}