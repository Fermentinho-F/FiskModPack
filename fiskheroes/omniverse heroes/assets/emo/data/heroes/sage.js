function init(hero) {
    hero.setName("Sage");
    hero.setTier(3);

    hero.setChestplate("Suit");

    hero.addPowers("emo:sage");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);

    hero.addKeyBind("CHARGE_ICE", "key.chargeIce", 1);
    hero.addKeyBind("BLADE", "key.iceSpike", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "COLD": 0.4
        }
    });
    hero.addDamageProfile("ICE_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "COLD": 0.2
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : entity.getData("fiskheroes:cryo_charge") > 0 ? "ICE_PUNCH" : null;
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:blade" || entity.getData("fiskheroes:cryo_charge") > 0 || entity.isBookPlayer();
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ICE":
        return !entity.getData("fiskheroes:blade");
    case "BLADE":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:cryo_charge") == 1 || entity.getData("fiskheroes:blade") || entity.isBookPlayer();
    default:
        return true;
    }
}
