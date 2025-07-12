var max_random = 1;
function init(hero) {
    hero.setName("Doctor Fate");
    hero.setAliases("fate");
    hero.setTier(10);
    
    hero.setHelmet("Helmet");

    hero.addPowers("jmctheroes:order_magic");
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.55, 1);

    hero.addKeyBind("TELEKINESIS", "key.telekinesis", -1);
    hero.addKeyBind("AIM", "Magic Blasts", 1);
    hero.addKeyBind("SHIELD", "key.forcefield", 2);
    hero.addKeyBind("CHARGED_BEAM", "Beam of Order", 3);
    hero.addKeyBind("TELEPORT", "Teleport", 4);
    hero.addKeyBind("FATE", "Summon the Power of Order", 5);

    hero.setAttributeProfile(getProfile);
    hero.setTierOverride(getTierOverride);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);

    hero.setTickHandler((entity, manager) => {
        if (!entity.isSneaking() && !entity.isOnGround() && entity.motionY() < -0.8) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
        var getRandomInt = (min, max) => {
            min = Math.ceil(min); 
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        };
        if (entity.getData("fiskheroes:beam_shooting_timer") == 0) {
            manager.setData(entity, "jmctheroes:dyn/random", getRandomInt(0, max_random));
        }
    });
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function getProfile(entity) {
    if (!entity.getData("jmctheroes:dyn/fate")) {
        return "INACTIVE";
    }
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("jmctheroes:dyn/fate"))) {
        return false;
    }
  
    switch (modifier.name()) {
    case "fiskheroes:teleportation":
        return entity.getData("jmctheroes:dyn/fate") && entity.getData("fiskheroes:aiming");
    case "fiskheroes:telekinesis":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:aiming");
    case "fiskheroes:repulsor_blast":
        return entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:telekinesis");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "TELEKINESIS":
        return entity.getData("jmctheroes:dyn/fate") && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:aiming");
    case "AIM":
        return entity.getData("jmctheroes:dyn/fate") && entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:shield_blocking");
    case "SHIELD":
        return entity.getData("jmctheroes:dyn/fate") && !entity.getData("fiskheroes:aiming") && entity.getData("fiskheroes:beam_charge") == 0;
    case "CHARGED_BEAM":
        return entity.getData("jmctheroes:dyn/fate") && !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:shield_blocking");
    case "TELEPORT":
        return entity.getData("jmctheroes:dyn/fate") && entity.getData("fiskheroes:aiming");
    default:
        return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("jmctheroes:dyn/fate") ? 10 : 0;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
