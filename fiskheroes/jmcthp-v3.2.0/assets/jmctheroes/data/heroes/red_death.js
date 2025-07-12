function init(hero) {
    hero.setName("Red Death/\u00A74\u00A7lTales of the Dark Multiverse");
    hero.setAliases("death");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("jmctheroes:dark_speed_force_connection", "jmctheroes:deathbatsuit");
    hero.addAttribute("PUNCH_DAMAGE", 5.1, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 7.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 3);
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 4);

    hero.addAttributeProfile("SPEED", speedProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setDamageProfile(getDamageProfile);
    hero.setAttributeProfile(getProfile);
    hero.addDamageProfile("SPEED_PUNCH", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 5
        }
    });
    
    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") && entity.getData("fiskheroes:speed") > 0.5);
        if (entity.getData("fiskheroes:speed_sprinting") != entity.getData("fiskheroes:energy_charging")) {
            manager.setData(entity, "fiskheroes:energy_charging", entity.getData("fiskheroes:speed_sprinting"));
        }
    });

}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : null;
}

function getProfile(entity) {
    if (entity.getData("fiskheroes:intangible")) {
        return "SPEED";
    }
}

function speedProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("STEP_HEIGHT", 1.0, 0);
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:lightning_cast") {
        return entity.getData("fiskheroes:speed") > 1 && entity.getData("fiskheroes:speeding") && entity.isSprinting();
    }
    else if (modifier.name() == "fiskheroes:flight") {
        return entity.getData("fiskheroes:intangible");
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "INTANGIBILITY":
        return entity.getData("fiskheroes:speed") > 1 && entity.getData("fiskheroes:dyn/intangibility_cooldown") == 0 && entity.getData("fiskheroes:speeding") && entity.isSprinting() && !entity.isOnGround();
    default:
        return true;
    }
}