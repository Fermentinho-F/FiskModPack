function init(hero) {
    hero.setName("Asta/\u00A7c\u00A7lAP 7");
    hero.setVersion("Black Clover:Elf Saga");
    hero.setTier(7);
    
    hero.setHelmet("Headband");
    hero.setChestplate("Jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:anti_mahou");
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.7, 0);
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    
    hero.addKeyBind("SHIELD", "Demon Slayer Sword", 1);
    hero.addKeyBind("CHARGE_ICE", "Charge Black Divider", 2);
    hero.addKeyBind("BLADE", "Demon Dweller Sword", 2);
    hero.addKeyBind("DEMON_DESTROYER", "Demon Destroyer Sword", 3);
    hero.addKeyBind("BLACKFORM", "Toggle Black Form", 4);
    hero.addKeyBind("OPEN_GRIMOIRE", "Open/Close Grimoire", 5);
    
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("BLACKSHIELD", blackshieldProfile);
    hero.addAttributeProfile("BLACKBLADE", blackbladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLACKBLADE", {
        "properties": {
            "EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 25,
                    "amplifier": 1
                }
            ]
        }
    });
    hero.addDamageProfile("BLACKSHIELD", {
        "properties": {
            "EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 25,
                    "amplifier": 1
                }
            ]
        }
    });
    hero.addDamageProfile("SHIELD", {
        "properties": {
            "EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 10,
                    "amplifier": 1
                }
            ]
        }
    });
    hero.addDamageProfile("BLADE", {
        "properties": {
            "EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 10,
                    "amplifier": 1
                }
            ]
        }
    });
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.3, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
    profile.addAttribute("REACH_DISTANCE", 3.0, 0);
}
function blackshieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("REACH_DISTANCE", 5.0, 0);
}
function blackbladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.7, 0);
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
}
function getProfile(entity) {
    if (entity.getData("fiskheroes:blade") && !entity.getData("tmhp:dyn/blackform")) {
        return "BLADE";
    }
    else if (entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/blackform")) {
        return "SHIELD";
    }
    else if (entity.getData("tmhp:dyn/blackform") && entity.getData("fiskheroes:shield")) {
        return "BLACKSHIELD";
    }
    else if (entity.getData("tmhp:dyn/blackform") && entity.getData("fiskheroes:blade")) {
        return "BLACKBLADE";
    }
        return null;
}
function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/grimoire_timer") == 1 && !entity.getData("fiskheroes:blade");
    case "CHARGE_ICE":
        return entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/blackform");
    case "BLADE":
        return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/grimoire_timer") == 1 && !entity.getData("fiskheroes:shield");
    case "DEMON_DESTROYER":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "BLACKFORM":
        return entity.getData("fiskheroes:shield") || entity.getData("fiskheroes:blade") || entity.getData("tmhp:dyn/blackform");
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:potion_immunity":
        return modifier.id() == "fate_release" == (entity.getData("fiskheroes:dyn/steeled"));
    case "fiskheroes:arrow_catching":
        return !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:blade");
    case "fiskheroes:controlled_flight":
        return entity.getData("tmhp:dyn/blackform");
    case "fiskheroes:cryo_charge":
        return entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/blackform");
    default:
        return true;
    }
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/blackform") ? 7 : 4;
}