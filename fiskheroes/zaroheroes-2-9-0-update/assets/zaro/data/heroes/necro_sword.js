function init(hero) {
    hero.setName("Necro Sword");
    hero.setTier(8);

    
    hero.setChestplate("item.superhero_armor.piece.torso");
    

    hero.addPowers("zaro:necrosword");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    
    
    hero.addKeyBind("SHIELD", "Necro Sword", 1);
    hero.addKeyBind("SHADOWDOME", "key.shadowDome", 5);
    hero.addKeyBind("ENERGY_PROJECTION", "key.cosmicBeam", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
     hero.addKeyBind("TELEKINESIS", "key.shadowChain", 4);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("NECROSWORD", necroswordProfile);
    hero.setHasProperty(hasProperty);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
}

function necroswordProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 12.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.25, 0);
    profile.addAttribute("PUNCH_DAMAGE", 128.50, 0);
    profile.addAttribute("SPRINT_SPEED", 0.55, 1);
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "NECROSWORD" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHADOWDOME":
        return entity.getData("fiskheroes:shield");
    case "TELEPORT":
        return entity.getData("fiskheroes:shield");
    case "ENERGY_PROJECTION":
        return entity.getData("fiskheroes:shield");
    case "TELEKINESIS":
        return !entity.getData("fiskheroes:shield") != null;
    default:
        return true;
    }
}
