function init(hero) {
    hero.setName("Sub-Zero/\u00A7c\u00A7lAP 7");
    hero.setVersion("Mortal Kombat 11");
    hero.setTier(8);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:cryomancer");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 7.0, 0);
    hero.addAttribute("MAX_HEALTH", 10.0, 0);
    
    hero.addKeyBind("CHARGE_ICE", "Charge Ice", 1);
    hero.addKeyBind("BLADE", "Ice Hammer", 2);
    hero.addKeyBind("TELEPORT", "Teleportation", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("ICEHAMMER", {
        "types": {
            "SHARP": 1.0,
            "COLD": 1.0
        }
    });
    hero.addDamageProfile("ICEPUNCH", {
        "types": {
            "BLUNT": 1.0,
            "COLD": 0.6
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ICE":
        return entity.getHeldItem().isEmpty();
    case "BLADE":
        return entity.getData("fiskheroes:cryo_charge") == 1;
    default:
        return true;
    }
}


function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:cryoball":
        return entity.getData("fiskheroes:cryo_charge") == 1;
    case "fiskheroes:icicles":
        return !entity.getData("fiskheroes:cryo_charge") == 1;
    case "fiskheroes:blade":
        return entity.getData("fiskheroes:cryo_charge") == 1;
    case "fiskheroes:damage_bonus":
        return modifier.id() == "blade" == (entity.getData("fiskheroes:blade"));
    case "fiskheroes:damage_bonus":
        return modifier.id() == "hand" == (!entity.getData("fiskheroes:blade"));
    default:
        return true;
    }
}
function getDamageProfile(entity) {
    if (entity.getData("fiskheroes:cryo_charge")) {
        return "ICE_PUNCH";
    }
    return entity.getData("fiskheroes:blade") ? "ICEHAMMER" : null;
}