function init(hero) {
    hero.setName("Shazam");
    hero.setVersion("item.superhero_armor.version.dceu");
    hero.setAliases("billy");
    hero.setTier(9);
    
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:shazam");
    hero.addAttribute("PUNCH_DAMAGE", -1.0, 0);
    
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Lightning Beam", 2);
    hero.addKeyBindFunc("func_TELEPORT", teleportOverrideKey, "Interstellar Travel", 3); 
    hero.addKeyBind("SHAZAM", "SHAZAM!!!", 5);

    hero.setHasProperty(hasProperty)
    hero.setDefaultScale(defaultScale);
    hero.setAttributeProfile(getProfile);
    hero.setTierOverride(getTierOverride);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("SHAZAM", shazamProfile);
    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        var shazam_timer = entity.getData("jmctheroes:dyn/shazam_timer");
        var onground = entity.isOnGround();
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        if (!onground && shazam_timer < 1 && shazam_timer > 0){
            manager.setData(entity, "fiskheroes:flying", true);
        }
    });
}

function defaultScale(entity) {
    if (entity.getData('jmctheroes:dyn/shazam') || entity.is("DISPLAY") || entity.as("DISPLAY").getDisplayType === "BOOK_PREVIEW") {
        return 1.0;
    }
    return 0.70;
}

function teleportOverrideKey(player, manager) {
    var x = player.posX();
    var y = player.posY();
    var z = player.posZ();
    var dim = player.world().getDimension();
    
    manager.setData(player, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, dim + 1));
    manager.setData(player, "fiskheroes:teleport_delay", 6);
    return true;
}

function shazamProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12.3, 0);
    profile.addAttribute("SPRINT_SPEED", 0.29, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    profile.addAttribute("WEAPON_DAMAGE", -0.5, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.15, 1);
    profile.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
}

function getProfile(entity) {
    if (entity.getData("jmctheroes:dyn/shazam")) {
        return "SHAZAM";
    }
}

function getTierOverride(entity) {
    return entity.getData("jmctheroes:dyn/shazam") ? 9 : 0;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:controlled_flight") {
        return (entity.getData("jmctheroes:dyn/shazam"));
    }
    else if (modifier.name() == "fiskheroes:fire_immunity") {
        return (entity.getData("jmctheroes:dyn/shazam"));
    }
    else if (modifier.name() == "fiskheroes:energy_projection") {
        return (entity.getData("jmctheroes:dyn/shazam"));
    }
    else if (modifier.name() == "fiskheroes:projectile_immunity") {
        return (entity.getData("jmctheroes:dyn/shazam"));
    }
    else if (modifier.name() == "fiskheroes:arrow_catching") {
        return (entity.getData("jmctheroes:dyn/shazam"));
    }
    else if (modifier.name() == "fiskheroes:super_speed") {
        return (entity.getData("jmctheroes:dyn/shazam") && !entity.getData("fiskheroes:flying"));
    }
    else if (modifier.name() == "fiskheroes:lightning_cast") {
        return (entity.getData("jmctheroes:dyn/shazam"));
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var height = entity.posY();
    switch (keyBind) {
    case "SUPER_SPEED":
        return (entity.getData("jmctheroes:dyn/shazam") && !entity.getData("fiskheroes:flying"));
    case "ENERGY_PROJECTION":
        return (entity.getData("jmctheroes:dyn/shazam"));
    case "func_TELEPORT":
        return entity.getData("jmctheroes:dyn/shazam") && (height) >= 512;
    default:
        return true;
    }    
}

function hasProperty(entity, property) {
    switch (property) {
    case "BREATHE_SPACE":
        return entity.getData("jmctheroes:dyn/shazam");
    default:
        return false;
    }
}
