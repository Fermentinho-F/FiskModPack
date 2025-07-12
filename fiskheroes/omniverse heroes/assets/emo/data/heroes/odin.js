function init(hero) {
    hero.setName("Odin"); 
    hero.setTier(8); 
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece"); 
    
    hero.addPowers("emo:odin"); 
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0); 
    hero.addAttribute("WEAPON_DAMAGE", 6.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    
    hero.addKeyBind("SPELL_MENU", "Odin Spells", 1);
    hero.addKeyBind("CHARGED_BEAM", "Energy Projection", 2);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 3);
    hero.addKeyBind("TELEPORT", "Teleport", 4);
    hero.addKeyBind("SHIELD", "Gungnir", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGED_BEAM":
            return entity.getData("fiskheroes:shield");
        case "TELEPORT":
            return entity.getData("fiskheroes:shield");
        case "TELEKINESIS":
            return entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}