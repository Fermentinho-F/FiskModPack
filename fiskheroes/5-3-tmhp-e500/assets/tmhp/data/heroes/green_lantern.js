var landing = implement("fiskheroes:external/superhero_landing");
var lanterns = implement("tmhp:external/lanterns");

function init(hero) {
    hero.setName("Green Lantern/\u00A7c\u00A7lAP 9");
    hero.setTier(9);
    
    hero.setChestplate("Ring");
    
    hero.addPowers("tmhp:ring", "tmhp:ring_green");
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    
    hero.addKeyBind("BLADE", "Sword", 1);
    hero.addKeyBind("HAMMER", "Hammer", 1);
    hero.addKeyBind("SHIELD", "Shield", 2);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 3);
    hero.addKeyBind("MECHA", "Mecha Armor", 3);
    hero.addKeyBind("ENERGY_PROJECTION", "Energy Beam", 4);
    hero.addKeyBind("CHARGED_BEAM", "Charged Beam", 4);
    hero.addKeyBind("JETPACK", "JetPack", 5);
    hero.addKeyBind("SUIT", "Active Ring", 5);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    
    hero.setHasProperty(hasProperty);
    hero.setDefaultScale(defaultScale);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("HAMMER", hammerProfile);
    hero.addAttributeProfile("MECHA", mechaProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7 }});

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
        lanterns.jetpack(entity, manager);
        lanterns.hammer(entity, manager);
        landing.tick(entity, manager);
  });
}

function defaultScale(entity) {
    if (entity.getData("tmhp:dyn/mecha")) {
        return 5.0;
    }
        return 1.0;
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/lantern") ? 9 : 0;
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 17.5, 0);
}
function hammerProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.2, 1);
    profile.addAttribute("PUNCH_DAMAGE", 30.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.01, 1);
}
function mechaProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.4, 1);
    profile.addAttribute("PUNCH_DAMAGE", 50.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.01, 1);
    profile.addAttribute("FALL_RESISTANCE", 30.0, 0);
}

function getProfile(entity) {
    if (!entity.getData("tmhp:dyn/lantern")) {
        return "INACTIVE";
    }
    else if (entity.getData("fiskheroes:dyn/steeled")) {
        return "HAMMER";
    }
    else if (entity.getData("tmhp:dyn/mecha")) {
        return "MECHA";
    }
    
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("tmhp:dyn/lantern") || modifier.name() == "fiskheroes:propelled_flight" && entity.getData("tmhp:dyn/lantern_timer") < 1)) {
        return false;
    }
  
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/mecha");
    case "fiskheroes:controlled_flight":
        return modifier.id() == "base_flight" ==  (!entity.getData("fiskheroes:dyn/nanites"));
    case "fiskheroes:controlled_flight":
        return modifier.id() == "jetpack_boost" == (entity.getData("fiskheroes:dyn/nanites"));
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "SUIT") {
        return entity.getData("fiskheroes:mask_open_timer") == 0 && !entity.getData("tmhp:dyn/mecha") && !entity.getData("fiskheroes:flying");
    }
    else if (!entity.getData("tmhp:dyn/lantern")) {
        return false;
    }
    
    switch (keyBind) {
    case "HAMMER":
        return entity.getData("fiskheroes:dyn/steeled") || entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:blade") && entity.isSneaking() && !entity.getData("tmhp:dyn/mecha");
    case "BLADE":
        return entity.getHeldItem().isEmpty() && !entity.isSneaking() && !entity.getData("fiskheroes:dyn/steeled") && !entity.getData("tmhp:dyn/mecha");
    case "ENERGY_PROJECTION":
        return !entity.getData("tmhp:dyn/mecha");
    case "CHARGED_BEAM":
        return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/mecha");
    case "SHIELD":
        return !entity.getData("tmhp:dyn/mecha") && !entity.isSprinting();
    case "JETPACK":
        return entity.getData("fiskheroes:flying");
    case "MECHA":
        return !entity.getData("fiskheroes:dyn/steeled") && !entity.getData("fiskheroes:flying");
    case "TELEKINESIS":
        return !entity.getData("fiskheroes:dyn/steeled") && entity.getData("fiskheroes:flying");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.getData("tmhp:dyn/lantern") == 1;
    case "BREATHE_SPACE":
        return entity.getData("tmhp:dyn/lantern");
    default:
        return false;
    }
}