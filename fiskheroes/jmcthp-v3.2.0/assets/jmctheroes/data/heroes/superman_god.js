var landing = implement("jmctheroes:external/hard_landing");
var super_boost = implement("fiskheroes:external/super_boost");

function init(hero) {
    hero.setName("Super-Moustache-Man");
    hero.setVersion("JMemeCT");
    hero.setTier(9);
    hero.hide();
    
    hero.setHelmet("Moustache");
    
    hero.addPowers("jmctheroes:kryptonian_physiology_dceu");
    hero.addAttribute("PUNCH_DAMAGE", 12.7, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("WEAPON_DAMAGE", -0.6, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.25, 1);

    hero.addKeyBind("ENERGY_PROJECTION", "Freeze Breath", 1);
    hero.addKeyBind("HEAT_VISION", "Moustache Beam", 2);
    hero.addKeyBind("CHARGED_BEAM", "Moustache Charged Beam", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
    
    super_boost.addKeyBind(hero, "key.boost", 4);
    hero.addKeyBindFunc("func_TELEPORT", teleportOverrideKey, "Interstellar Travel", 4);

    hero.setHasProperty(hasProperty);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
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
    if (entity.getData("jmctheroes:dyn/moon_timer") > 0.4 && entity.getData("jmctheroes:dyn/moon_timer") < 0.8) {
        return "BOOST";
    }
    else if (entity.getData("jmctheroes:dyn/moon_timer") > 0.8) {
        return "FULLBOOST";
    }
}

function powerboostProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 13, 0);
    profile.addAttribute("SPRINT_SPEED", 0.45, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.3, 1);
}

function powerfullboostProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 14, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("IMPACT_DAMAGE", 0.35, 1);
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
    default:
        return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}