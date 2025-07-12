var landing = implement("fiskheroes:external/superhero_landing");
var lanterns = implement("tmhp:external/lanterns");

function init(hero) {
    hero.setName("Yellow Lantern/\u00A7c\u00A7lAP 7");
    hero.setVersion("Sinestro");
    hero.setTier(9);
    
    hero.setChestplate("Ring");
    
    hero.addPowers("tmhp:ring", "tmhp:ring_yellow");
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    
    hero.addKeyBind("BLADE", "Sword", 1);
    hero.addKeyBind("SCYTHE", "Scythe", 1);
    hero.addKeyBind("SHIELD", "Shield", 2);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 3);
    hero.addKeyBind("ENERGY_PROJECTION", "Energy Beam", 4);
    hero.addKeyBind("JETPACK", "JetPack", 5);
    hero.addKeyBind("SUIT", "Active Armor", 5);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTierOverride(getTierOverride);
    
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("SCYTHE", scytheProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        },
        "properties": {
              "EFFECTS": [
                {
                  "id": "minecraft:blindness",
                  "duration": 30,
                  "amplifier": 1
                }
             ]
        }
    });
    hero.addDamageProfile("SCYTHE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        },
        "properties": {
              "EFFECTS": [
                {
                  "id": "minecraft:blindness",
                  "duration": 50,
                  "amplifier": 1
                }
             ]
        }
    });
    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
        lanterns.jetpack(entity, manager);
        lanterns.hammer(entity, manager);
        landing.tick(entity, manager);
    });
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
function scytheProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.5, 0);
}

function getProfile(entity) {
    if (!entity.getData("tmhp:dyn/lantern")) {
        return "INACTIVE";
    }
    else if (entity.getData("fiskheroes:dyn/steeled")) {
        return "SCYTHE";
    }
    
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("tmhp:dyn/lantern") || modifier.name() == "fiskheroes:propelled_flight" && entity.getData("tmhp:dyn/lantern_timer") < 1)) {
        return false;
    }
  
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield");
    case "fiskheroes:controlled_flight":
        return modifier.id() == "base_flight" ==  (!entity.getData("fiskheroes:dyn/steel_timer") && !entity.getData("tmhp:dyn/mecha") && !entity.getData("fiskheroes:dyn/nanites"));
    case "fiskheroes:controlled_flight":
        return modifier.id() == "jetpack_boost" == (entity.getData("fiskheroes:dyn/nanites"));
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind == "SUIT") {
        return !entity.getData("fiskheroes:flying") && entity.getData("fiskheroes:mask_open_timer") == 0;
    }
    else if (!entity.getData("tmhp:dyn/lantern")) {
        return false;
    }
    
    switch (keyBind) {
    case "TELEPORT":
        return entity.getData("fiskheroes:flying");
    case "SCYTHE":
        return entity.getData("fiskheroes:dyn/steeled") || entity.getHeldItem().isEmpty() && entity.isSneaking() && !entity.getData("fiskheroes:blade");
    case "BLADE":
        return entity.getHeldItem().isEmpty() && !entity.isSneaking() && !entity.getData("fiskheroes:dyn/steeled");
    case "TELEKINESIS":
        return !entity.getData("fiskheroes:dyn/steeled") && entity.getData("fiskheroes:flying");
    case "SHIELD":
        return !entity.isSprinting();
    case "JETPACK":
        return entity.getData("fiskheroes:flying");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    switch (property) {
    case "BREATHE_SPACE":
        return entity.getData("tmhp:dyn/lantern");
    default:
        return false;
    }
}