function init(hero) {
    hero.setName("Yuno/\u00A7c\u00A7lAP 7");
    hero.setVersion("Black Clover:Elf Saga");
    hero.setTier(7);
    
    hero.setChestplate("Jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:kaze_mahou");
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    
    hero.addKeyBind("AIM", "Wind Blades Shower(Aim)", 1);
    hero.addKeyBind("CHARGED_BEAM", "Spirit Storm", 1);
    hero.addKeyBind("EARTHQUAKE", "Towering Tornado", 2);
    hero.addKeyBind("SHIELD", "Spirit of Zephyr", 2);
    hero.addKeyBind("SPIRITDIVE", "Toggle Spirit Dive", 4);
    hero.addKeyBind("OPEN_GRIMOIRE", "Open/Close Grimoire", 5);
    
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("SPIRITDIVE", spiritdiveProfile);
    hero.setAttributeProfile(getProfile);
    hero.supplyFunction("canAim", canAim);
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
}
function spiritdiveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.7, 1);
}
function getProfile(entity) {
    if (entity.getData("tmhp:dyn/spiritdive") && entity.getData("fiskheroes:shield")) {
        return "SHIELD";
    }
    else if (entity.getData("tmhp:dyn/spiritdive") && !entity.getData("fiskheroes:shield")) {
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
        return !entity.getData("tmhp:dyn/spiritdive") && entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "EARTHQUAKE":
        return !entity.getData("tmhp:dyn/spiritdive") && entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "CHARGED_BEAM":
        return entity.getData("tmhp:dyn/spiritdive");
    case "SHIELD":
        return entity.getData("tmhp:dyn/spiritdive");
    case "SPIRITDIVE":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1;
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:shield":
        return entity.getData("tmhp:dyn/spiritdive");
    case "fiskheroes:controlled_flight":
        return modifier.id() == "flight_base" == (!entity.getData("tmhp:dyn/spiritdive"));
    case "fiskheroes:controlled_flight":
        return modifier.id() == "flight_sd" == (entity.getData("tmhp:dyn/spiritdive"));
    case "fiskheroes:charged_beam":
        return modifier.id() == "spirit_storm" == (entity.getData("tmhp:dyn/spiritdive"));
    case "fiskheroes:charged_beam":
        return modifier.id() == "spirit_of_euros" == (entity.getData("tmhp:dyn/spiritdive2"));
    default:
        return true;
    }
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/spiritdive") ? 7 : 4;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}