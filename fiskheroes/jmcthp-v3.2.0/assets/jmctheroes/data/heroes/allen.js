var landing = implement("jmctheroes:external/hard_landing");
var super_boost = implement("fiskheroes:external/super_boost");

function init(hero) {
    hero.setName("Allen The Alien");
    hero.setVersion("Invincible");
    hero.setAliases("allen");
    hero.setTier(9);
    
    hero.setHelmet("Head");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Feet");
    
    hero.addPowers("jmctheroes:unopan_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 12.8, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("WEAPON_DAMAGE", -0.5, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.1, 1);
    
    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);

    super_boost.addKeyBind(hero, "key.boost", 4);
    hero.addKeyBindFunc("func_TELEPORT", teleportOverrideKey, "Interstellar Travel", 4);

    hero.setDefaultScale(1.1);
    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);   
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


function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:regeneration") {
        return entity.getHealth() < 3;
    }
    return super_boost.isModifierEnabled(entity, modifier);
}

function isKeyBindEnabled(entity, keyBind) {
    var height = entity.posY();
    switch (keyBind) {
        case "func_TELEPORT":
            return entity.getData("jmctheroes:dyn/flight_super_boost_timer") > 0.1 && (height) > 512 && entity.motionY() > 1;
        default:
            return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}