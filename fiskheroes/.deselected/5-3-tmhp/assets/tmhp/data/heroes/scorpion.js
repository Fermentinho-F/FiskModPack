var hellfire_katana = implement("tmhp:external/hellfire_katana");
function init(hero) {
    hero.setName("Scorpion/\u00A7c\u00A7lAP 7");
    hero.setVersion("Mortal Kombat 11");
    hero.setTier(8);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:katana", true, item => !item.nbt().getBoolean("Dual"));
    
    hero.addPowers("tmhp:hellfire");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 7.0, 0);
    hero.addAttribute("MAX_HEALTH", 10.0, 0);
    
    hero.addKeyBind("SPELL_MENU", "Spear", 1);
    hero.addKeyBind("TELEPORT", "Hellport", 2);
    hero.addKeyBind("CHARGED_BEAM", "Fire Breath", 3);
    hero.addKeyBind("CHARGED_PUNCH", "Toggle Hellfire Punch", 5);
    hero.addKeyBind("HELLFIREKATANA", "Toggle Misery Blade", 5);
    
    hero.addAttributeProfile("PUNCH", punchProfile);
    hero.addAttributeProfile("HELLFIREKATANA", hellfirekatanaProfile);
    hero.addAttributeProfile("BLUNT", bluntProfile);
    hero.addAttributeProfile("STOP", stopProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setDamageProfile(getAttributeProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTickHandler((entity, manager) => {
        hellfire_katana.hellfire_katana(entity, manager);
    });
    hero.addDamageProfile("HELLFIREKATANA", {
        "types": {
            "HELLFIRE": 2.0
        },
        "properties": {
            "COOK_ENTITY": true,
            "HEAT_TRANSFER": 220,
            "IGNITE": 6
        }
    });
    hero.addDamageProfile("PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "HELLFIRE": 2.0
        },
        "properties": {
            "COOK_ENTITY": true,
            "HEAT_TRANSFER": 220,
            "IGNITE": 6
        }
    });
    hero.addDamageProfile("BLUNT", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 1.0
        },
        "properties": {
            "HEAT_TRANSFER": 20,
            "IGNITE": 2
        }
    });
}
function punchProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    profile.addAttribute("KNOCKBACK", 5.0, 0);
}
function bluntProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    profile.addAttribute("BASE_SPEED", -0.2, 1);
}
function stopProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
}
function hellfirekatanaProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("WEAPON_DAMAGE", 15.0, 0);
}
function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:beam_charge")) {
        return "STOP";
    }
    else if (entity.getData("tmhp:dyn/electrical")) {
        return "HELLFIREKATANA";
    }
    return entity.getData("fiskheroes:punchmode") ? entity.getData("fiskheroes:punch_charged") ? "PUNCH" : "BLUNT" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "HELLFIREKATANA":
        return entity.getHeldItem().name() == "fiskheroes:katana";
    case "CHARGED_PUNCH":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}