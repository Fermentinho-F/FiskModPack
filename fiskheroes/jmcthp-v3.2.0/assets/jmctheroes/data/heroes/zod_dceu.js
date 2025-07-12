var landing = implement("jmctheroes:external/hard_landing");
var super_boost = implement("fiskheroes:external/super_boost");

function init(hero) {
    hero.setName("General Zod");
    hero.setVersion("item.superhero_armor.version.dceu");
    hero.setAliases("Zod", "Dru_Zod");
    hero.setTier(9);
    
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:kryptonian_physiology_dceu_earth");
    hero.addAttribute("PUNCH_DAMAGE", 12.2, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("WEAPON_DAMAGE", -0.7, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.1, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 1.0, 0);

    hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
    hero.addKeyBind("CHARGED_BEAM", "Solar Charged Heat Vision", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 4);
    
    super_boost.addKeyBind(hero, "key.boost", 4);
    hero.addKeyBindFunc("func_TELEPORT", teleportOverrideKey, "Interstellar Travel", 4);

    hero.setHasProperty(hasProperty);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("JUMP", superjumpProfile);
    hero.addAttributeProfile("BOOST", powerboostProfile);
    hero.addAttributeProfile("FULLBOOST", powerfullboostProfile);
    hero.setTickHandler((entity, manager) => {
        landing.tick(entity, manager);
        super_boost.tick(entity, manager);
        var speed = 0.1;
        var speed_boost = entity.getData("jmctheroes:dyn/flight_super_boost_timer");
        if (entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && speed_boost > 0) {
            manager.setData(entity,"jmctheroes:dyn/flight_super_boost_timer", speed_boost - speed)
        }
        if (entity.getData("fiskheroes:dyn/flight_super_boost") > 0 && speed_boost < 1) {
            manager.setData(entity,"jmctheroes:dyn/flight_super_boost_timer", speed_boost + speed)
        }
        if (entity.getData("fiskheroes:dyn/flight_super_boost") == 0 && speed_boost < 0.1) {
            manager.setData(entity,"jmctheroes:dyn/flight_super_boost_timer", 0)
        }
        if (entity.getData("jmctheroes:dyn/moon")) {
            manager.setData(entity, "jmctheroes:dyn/moon", false);
        }
        if (entity.world().getDimension() == 2595 && entity.posY() >= 200) {
            manager.setData(entity, "jmctheroes:dyn/moon", true);
            manager.setData(entity, "jmctheroes:dyn/moon_timer", entity.getData("jmctheroes:dyn/moon_timer") + 0.000001);
        }
        if (!entity.isSneaking() && !entity.isOnGround() && entity.motionY() < -0.8 && entity.posY() >= 100) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
    });
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

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function getProfile(entity) {
    if (entity.getData("jmctheroes:dyn/sneaking_timer") == 1) {
        return "JUMP";
    }
    if (entity.getData("jmctheroes:dyn/moon_timer") > 0.4 && entity.getData("jmctheroes:dyn/moon_timer") < 0.8) {
        return "BOOST";
    }
    else if (entity.getData("jmctheroes:dyn/moon_timer") > 0.8) {
        return "FULLBOOST";
    }
}

function superjumpProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", 40.0, 0);
}
function powerboostProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 12.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.42, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.2, 1);
}
function powerfullboostProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 13.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.47, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.23, 1);
}

function isModifierEnabled(entity, modifier) {
    var height = entity.posY();
    switch (modifier.name()) {
    case "fiskheroes:energy_projection":
        return !entity.getData("fiskheroes:beam_shooting") && !entity.getData("fiskheroes:heat_vision_timer");
    case "fiskheroes:heat_vision|normal":
        return entity.getData("jmctheroes:dyn/moon_timer") < 0.4 && !entity.getData("fiskheroes:energy_projection") && (height) < 512;
    case "fiskheroes:heat_vision|charged":
        return entity.getData("jmctheroes:dyn/moon_timer") > 0.4 && entity.getData("jmctheroes:dyn/moon_timer") < 0.8 && !entity.getData("fiskheroes:energy_projection") && (height) < 512;
    case "fiskheroes:charged_beam":
        return entity.getData("jmctheroes:dyn/moon_timer") > 0.8 && !entity.getData("fiskheroes:energy_projection") && (height) < 512;
    case "fiskheroes:super_speed":
        return !entity.getData("fiskheroes:flying");
    default:
        return super_boost.isModifierEnabled(entity, modifier);
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var height = entity.posY();
    switch (keyBind) {
    case "func_TELEPORT":
        return entity.getData("jmctheroes:dyn/flight_super_boost_timer") > 0.1 && (height) > 512 && entity.motionY() > 1;
    case "CHARGED_BEAM":
        return entity.getData("jmctheroes:dyn/moon_timer") > 0.8 && (height) < 512;
    case "HEAT_VISION":
        return entity.getData("jmctheroes:dyn/moon_timer") < 0.8 && (height) < 512;
    case "SUPER_SPEED":
        return !entity.getData("fiskheroes:flying");
    default:
        return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}