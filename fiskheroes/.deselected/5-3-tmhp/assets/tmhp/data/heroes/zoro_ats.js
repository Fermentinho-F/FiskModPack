var haki = implement("tmhp:external/haki");
function init(hero) {
    hero.setName("Zoro/\u00A7c\u00A7lAP 9");
    hero.setVersion("One Piece After Timeskip");
    hero.setTier(9);
    
    hero.setChestplate("Kimino");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:haki" ,"tmhp:santoryuu");
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    
    hero.addKeyBind("BLADE", "Three Sword Style", 1);
    hero.addKeyBind("SHIELD", "Block", 2);
    hero.addKeyBind("CHARGE_ENERGY", "Pandaho", 3);
    hero.addKeyBind("CHARGED_BEAM", "Nitoryuu Iai Rashomon", 4);
    hero.addKeyBind("HAKI", "Armament Haki", 5);
    
    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("HAKI", hakiProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.setTickHandler((entity, manager) => {
        haki.haki(entity, manager);
    });
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 5
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 25.0, 0);
}

function hakiProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 50.0, 0);
}


function getProfile(entity) {
    if (entity.getData("tmhp:dyn/haki") && entity.getData("fiskheroes:blade")) {
        return "HAKI";
    }
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGED_BEAM":
        return entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shield_blocking");
    case "CHARGE_ENERGY":
        return entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shield_blocking");
    case "SHIELD":
        return entity.getData("fiskheroes:blade");
    case "HAKI":
        return entity.getData("fiskheroes:blade");
    default:
        return true;
    }
}
function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:charged_beam":
        return modifier.id() == "rashomon" == (!entity.getData("tmhp:dyn/haki"));
    case "fiskheroes:charged_beam":
        return modifier.id() == "rashomon_haki" == (entity.getData("tmhp:dyn/haki"));
    case "fiskheroes:energy_manipulation":
        return modifier.id() == "pandaho" == (!entity.getData("tmhp:dyn/haki") && !entity.getData("fiskheroes:shield_blocking"));
    case "fiskheroes:energy_manipulation":
        return modifier.id() == "pandaho_haki" == (entity.getData("tmhp:dyn/haki") && !entity.getData("fiskheroes:shield_blocking"));
    default:
        return true;
    }
}