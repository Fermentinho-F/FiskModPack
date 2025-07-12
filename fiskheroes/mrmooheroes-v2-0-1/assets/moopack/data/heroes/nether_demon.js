function init(hero) {
    hero.setName("Nether Demon");
    hero.setTier(7);

    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");

    hero.addPowers("moopack:demonic_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);

    hero.addKeyBind("AIM", "Hell Flames", 1);
    hero.addKeyBind("CHARGED_BEAM", "Penance Beam", 2);
    hero.addKeyBind("SHADOWFORM", "key.shadowForm", 3);

    hero.setDefaultScale(1.25);

    hero.supplyFunction("canAim", canAim);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

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
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:charged_beam":
            return !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:aiming");
        case "fiskheroes:flight":
            return entity.getData("fiskheroes:shadowform");
        case "fiskheroes:aiming":
            return !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting");
        case "fiskheroes:shadowform":
            return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGED_BEAM":
            return !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:aiming");
        case "AIM":
            return !entity.getData("fiskheroes:shadowform") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting");
        case "SHADOWFORM":
            return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting");
    default:
        return true;
    }
}