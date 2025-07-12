var suit = implement("shadows:external/return_to_random");
function init(hero) {
    hero.setName("Superior Spider");
    hero.setTier(8);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("shadows:spider_physiology", "shadows:web_shooters_superior_spider", "shadows:superior_spider_arms", "fiskheroes:web_wings");
    
    hero.addAttribute("FALL_RESISTANCE", 12, 0);
    hero.addAttribute("JUMP_HEIGHT", 5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 1, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.55, 1);

    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("BLADE", "Talons", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBindFunc("func_WEB_WINGS", webWingsKey, "key.webWings", 5);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
    hero.addKeyBind("MINIATURIZE_SUIT", "key.miniaturizeSuit", 4);
    hero.addKeyBind("TENTACLES", "key.tentacles", 5);
    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);

    hero.addAttributeProfile("TALONS", (profile) => {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    });
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("TALONS", {"types": {"SHARP": 1.0}});

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.setTickHandler((entity, manager) => {
        // return to random
        suit.returnSuit(entity, manager);
    });
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "TALONS" : null;
}

function webSwingingKey(entity, manager) {
    var flag = entity.getData("fiskheroes:web_swinging");
    if (!flag) {
        manager.setDataWithNotify(entity, "fiskheroes:prev_utility_belt_type", entity.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(entity, "fiskheroes:utility_belt_type", -1);
    }
    manager.setDataWithNotify(entity, "fiskheroes:web_swinging", !flag);
    return true;
}

function webWingsKey(entity, manager) {
    if (entity.isOnGround() || entity.isInWater()) {
        return false;
    }
    var flag = entity.getData("fiskheroes:gliding");
    if (!flag) {
        manager.setDataWithNotify(entity, "fiskheroes:prev_utility_belt_type", entity.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(entity, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(entity, "fiskheroes:web_swinging", false);

    }
    manager.setDataWithNotify(entity, "fiskheroes:gliding", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:tentacles");
    case "fiskheroes:web_zip":
        return !entity.getData("fiskheroes:gliding");
    case "fiskheroes:leaping":
        return (modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5)) && !entity.getData("fiskheroes:gliding");
    case "fiskheroes:tentacles":
        return !entity.getData("fiskheroes:gliding");
    case "fiskheroes:gliding":
        return !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem() && entity.getData("fiskheroes:tentacles") == null;
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function isKeyBindEnabled(entity, keyBind) {
    var tentacles = entity.getData('fiskheroes:tentacles') != null;
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() && !tentacles;
    case "UTILITY_BELT":
        return !tentacles && !entity.isSneaking();
    case "BLADE":
        return entity.isSneaking();
    case "WEB_ZIP":
        return !tentacles;
    case "TENTACLE_JAB":
        return tentacles && !entity.isSneaking();
    case "SLOW_MOTION":
        return !entity.isSneaking();
    case "MINIATURIZE_SUIT":
        return entity.isSneaking();
    case "func_WEB_WINGS":
        return entity.getData("fiskheroes:web_swinging") && !entity.isOnGround() && !entity.isInWater() || entity.getData("fiskheroes:gliding_timer") > 0 && !tentacles;
    case "TENTACLES":
        return !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:gliding_timer") == 0 || entity.getData("fiskheroes:web_swinging") && (entity.isOnGround() || entity.isInWater() || tentacles);
    default:
        return true;
    }
}
