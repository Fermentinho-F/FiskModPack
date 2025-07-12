function init(hero) {
    hero.setName("Green Lantern Corp");
    hero.setAliases("greenring");
    hero.setTier(9);
    
    hero.setChestplate("Ring");

    hero.addPowers("jmctheroes:green_lantern_corp_ring");
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    
    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("SHIELD", "Wall Construct", 2);
    hero.addKeyBind("BLADE", "Punching Glove Construct", 3);
    hero.addKeyBind("TELEKINESIS", "Transport Entity", 4);
    hero.addKeyBind("CHARGED_BEAM", "Energy Beam", 4);
    hero.addKeyBindFunc("func_TELEPORT", teleportOverrideKey, "Interstellar Travel", 5); 
    hero.addKeyBind("LANTERN", "Transform", 5);

    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.supplyFunction("canAim", canAim);
    hero.setAttributeProfile(getProfile);
    hero.setHasProperty(hasProperty);

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        var suit_timer = entity.getData("jmctheroes:dyn/suit_timer");
        var onground = entity.isOnGround();
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        if (!onground && suit_timer < 1 && suit_timer > 0){
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
    switch (property) {
    case "BREATHE_SPACE":
        return entity.getData("jmctheroes:dyn/suit");
    default:
        return false;
    }
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function getProfile(entity) {
    if (!entity.getData("jmctheroes:dyn/suit")) {
        return "INACTIVE";
    }
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("jmctheroes:dyn/suit"))) {
        return false;
    }  
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return entity.getData("jmctheroes:dyn/suit");
    case "fiskheroes:telekinesis":
        return entity.getData("jmctheroes:dyn/suit") && entity.getData("fiskheroes:flying");
    case "fiskheroes:repulsor_blast":
        return entity.getData("jmctheroes:dyn/suit") && !entity.getData("fiskheroes:flight_boost_timer") == 1;
    case "fiskheroes:charged_beam":
        return entity.getData("jmctheroes:dyn/suit") && !entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:blade");
    case "fiskheroes:blade":
        return entity.getData("jmctheroes:dyn/suit") && !entity.getData("fiskheroes:flight_boost_timer") == 1;
    case "fiskheroes:shield":
        return entity.getData("jmctheroes:dyn/suit") && !entity.getData("fiskheroes:flight_boost_timer") == 1;
    case "fiskheroes:teleportation":
        return entity.getData("jmctheroes:dyn/suit");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.getData("jmctheroes:dyn/torch")) {
        return false;
    }
    var height = entity.posY();

    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().isEmpty() && entity.getData("jmctheroes:dyn/suit_timer") == 1 && !entity.getData("fiskheroes:flight_boost_timer") == 1  && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:blade");
    case "TELEKINESIS":
        return entity.getData("jmctheroes:dyn/suit_timer") == 1 && entity.getData("fiskheroes:flying");        
    case "SHIELD":
        return entity.getData("jmctheroes:dyn/suit_timer") == 1 && !entity.getData("fiskheroes:flight_boost_timer") == 1;
    case "BLADE":
        return entity.getData("jmctheroes:dyn/suit_timer") == 1 && !entity.getData("fiskheroes:flight_boost_timer") == 1;
    case "CHARGED_BEAM":
        return entity.getData("jmctheroes:dyn/suit_timer") == 1 && !entity.getData("fiskheroes:flying")  && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:blade");
    case "func_TELEPORT":
        return entity.getData("jmctheroes:dyn/suit_timer") == 1 && entity.getData("fiskheroes:flight_boost_timer") == 1 && (height) >= 512;
    case "LANTERN":
        return !entity.getData("fiskheroes:flight_boost_timer") == 1 && entity.getData("jmctheroes:dyn/suit_timer") == 0 || !entity.getData("fiskheroes:flight_boost_timer") == 1 && entity.getData("jmctheroes:dyn/suit_timer") == 1;
    default:
        return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("jmctheroes:dyn/suit") ? 9 : 0;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("jmctheroes:dyn/suit");
}