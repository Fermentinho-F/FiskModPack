function init(hero) {
    hero.setName("Yuno/\u00A7c\u00A7lAP 7");
    hero.setVersion("Black Clover:Spade Saga");
    hero.setTier(9);
    
    hero.setChestplate("Jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:kaze_mahou");
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.8, 1);
    
    hero.addKeyBind("AIM", "Wind Blades Shower(Aim)", 1);
    hero.addKeyBind("SHIELD", "Spirit of Zephyr", 1);
    hero.addKeyBind("EARTHQUAKE", "Towering Tornado", 2);
    hero.addKeyBind("BLADE", "Spirit of Boreas", 2);
    hero.addKeyBind("CHARGED_BEAM", "Spirit of Euros", 3);
    hero.addKeyBind("SPIRITDIVE2", "Toggle Spirit Dive", 4);
    hero.addKeyBind("OPEN_GRIMOIRE", "Open/Close Grimoire", 5);
    
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("SPIRITDIVE", spiritdive2Profile);
    hero.setAttributeProfile(getProfile);
    hero.supplyFunction("canAim", canAim);
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 60.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 50.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
    profile.addAttribute("REACH_DISTANCE", 5.0, 0);
}
function spiritdive2Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.7, 1);
}
function getProfile(entity) {
    if (entity.getData("tmhp:dyn/spiritdive2") && entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:blade")) {
        return "SHIELD";
    }
    else if (entity.getData("tmhp:dyn/spiritdive2") && !entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    else if (entity.getData("tmhp:dyn/spiritdive2") && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:blade")) {
        return "SPIRITDIVE";
    }
    return null;
}
function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "AIM":
        return !entity.getData("tmhp:dyn/spiritdive2") && entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "EARTHQUAKE":
        return !entity.getData("tmhp:dyn/spiritdive2") && entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "CHARGED_BEAM":
        return entity.getData("tmhp:dyn/spiritdive2") && !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shield");
    case "SHIELD":
        return entity.getData("tmhp:dyn/spiritdive2") && !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:beam_charging");
    case "BLADE":
        return entity.getData("tmhp:dyn/spiritdive2") && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:beam_charging");
    case "SPIRITDIVE2":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 || entity.getData("tmhp:dyn/spiritdive2");
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:shield":
        return entity.getData("tmhp:dyn/spiritdive2") && !entity.getData("fiskheroes:blade");
    case "fiskheroes:blade":
        return entity.getData("tmhp:dyn/spiritdive2") && !entity.getData("fiskheroes:shield");
    case "fiskheroes:controlled_flight":
        return modifier.id() == "flight_base" == (!entity.getData("tmhp:dyn/spiritdive2"));
    case "fiskheroes:controlled_flight":
        return modifier.id() == "flight_sd" == (entity.getData("tmhp:dyn/spiritdive2"));
    case "fiskheroes:charged_beam":
        return modifier.id() == "spirit_storm" == (entity.getData("tmhp:dyn/spiritdive"));
    case "fiskheroes:charged_beam":
        return modifier.id() == "spirit_of_euros" == (entity.getData("tmhp:dyn/spiritdive2"));
    default:
        return true;
    }
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/spiritdive2") ? 9 : 5;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}