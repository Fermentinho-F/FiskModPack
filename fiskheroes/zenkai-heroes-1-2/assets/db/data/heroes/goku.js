function init(hero) {
    hero.setName("Goku");
    hero.setAliases("Kakaroto");
    hero.setTier(9);

    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("db:goku_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 12.5, 0);

    hero.addKeyBind("NULL1", "Null", -1);
    hero.addKeyBind("NULL2", "Null", -1);
    hero.addKeyBind("AIMOFF", "Ki Charge", 1);
    hero.addKeyBind("AIM", "Ki Charge", 1);
    hero.addKeyBind("AIMM", "Ki Charge", 1);
    hero.addKeyBind("TELEPORT", "Instant Transmission", 2);
    hero.addKeyBind("CHARGED_BEAM", "Kamehameha", 3);
    hero.addKeyBind("SUPER_BEAM", "Super-Kamehameha", 3);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("SSJ", ssjProfile);
    hero.addAttributeProfile("SSJCHARGE", ssjchargeProfile);
    hero.addAttributeProfile("KAME", kameProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});

    hero.addSoundEvent("PUNCH", "db:punch");
    hero.addSoundEvent("AIM_START", "db:auraon");
    hero.addSoundEvent("AIM_START", "db:gokubasegrito");
    hero.addSoundEvent("AIM_START", "db:gokussjgrito");
    hero.addSoundEvent("AIM_STOP", "db:auraoff");
    hero.addSoundEvent("AIM_START", "db:kiloop");
    
    hero.setTickHandler((entity, manager) => {
        if (entity.isAlive()) {
                manager.incrementData(entity, "db:dyn/ki_cooldown", 100000000, true);
        }
        if (entity.getData("fiskheroes:aiming")) {
            manager.incrementData(entity, "db:dyn/ki_cooldown", 100, false);
            manager.incrementData(entity, "db:dyn/ki_cooldown", 100000000, true);
        }
        if (entity.getData("fiskheroes:teleport_timer")) {
            manager.incrementData(entity, "db:dyn/ki_cooldown", 70, true);
        }
        if (entity.getData("fiskheroes:flying")) {
            manager.incrementData(entity, "db:dyn/ki_cooldown", 5000, true);
        }
        if (entity.getData("fiskheroes:dyn/nanites") && entity.getData("fiskheroes:beam_shooting")) {
            manager.incrementData(entity, "db:dyn/ki_cooldown", 30, true);
            manager.setData(entity, "fiskheroes:energy_projection", true);
        }
        if (!entity.getData("fiskheroes:beam_shooting")) {
            manager.setData(entity, "fiskheroes:energy_projection", false);
        }
        if (!entity.getData("fiskheroes:dyn/nanites") && entity.getData("fiskheroes:beam_shooting")) {
            manager.incrementData(entity, "db:dyn/ki_cooldown", 50, true);
        }
        if (entity.getData("db:dyn/ki_cooldown") > 0.9) {
            manager.setData(entity, "fiskheroes:flying", false);
        }
        if (entity.isSneaking()) {
                manager.setData(entity, "db:dyn/ssjrecharge", true);
        }
        if (entity.motionZ() && !entity.isSneaking()) {
                manager.setData(entity, "db:dyn/ssjrecharge", false);
        }
        if (entity.getData("fiskheroes:aiming") && entity.isSneaking()) {
                manager.setData(entity, "db:dyn/ssjrecharge", true);
                manager.setData(entity, "fiskheroes:dyn/nanites", false);
                manager.setData(entity, "db:dyn/ki", false);
                manager.setData(entity, "db:dyn/glow", true);
                entity.playSound("db:ssjoff", 0.7, 0.9 + Math.random() * 0.3);
        }
        if (!entity.getData("db:dyn/ki") && entity.getData("fiskheroes:dyn/nanites")) {
                manager.setData(entity, "db:dyn/ssjrecharge", true);
                manager.setData(entity, "fiskheroes:dyn/nanites", false);
                manager.setData(entity, "db:dyn/glow", true);
                entity.playSound("db:ssjoff", 0.7, 0.9 + Math.random() * 0.3);
        }
        if (entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:dyn/nanites") && !entity.isOnGround() && entity.getData('fiskheroes:time_since_damaged') > 10) {
                manager.setData(entity, "fiskheroes:dyn/nanites", true);
                manager.setData(entity, "db:dyn/ki", true);
                manager.setData(entity, "db:dyn/glow", true);
                entity.playSound("db:ssjon", 0.7, 0.9 + Math.random() * 0.3);
                entity.playSound("db:gokussjtransformation", 1.0, 1.0 + Math.random() * 0.0);
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "NULL1":
        return entity.getData("fiskheroes:aiming") 
    case "NULL2":
        return entity.getData("fiskheroes:beam_charging")
    case "AIM":
        return !entity.motionZ() && !entity.getData("db:dyn/ssjrecharge_timer") && !entity.getData("fiskheroes:beam_charging")
    case "AIMM":
        return !entity.getData("db:dyn/ssjrecharge_timer") && !entity.getData("fiskheroes:beam_charging")
    case "AIMOFF":
        return !entity.getData("fiskheroes:aiming") && entity.getData("db:dyn/ki_cooldown") < 0.6;
    case "SUPER_BEAM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:aiming") && entity.getData("fiskheroes:dyn/nanites") && entity.getData("db:dyn/ki_cooldown") < 0.6;
    case "CHARGED_BEAM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:aiming") && entity.getData("db:dyn/ki_cooldown") < 0.6;
    case "TELEPORT":
        return !entity.getData("fiskheroes:aiming") && entity.getData("db:dyn/ki_cooldown") < 0.6;
    default:
            return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? 10 : 3;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:regeneration":
            return entity.getData("fiskheroes:aiming");               
        default:
            return true;
    }
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.10, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.6, 0);
    profile.addAttribute("FALL_RESISTANCE", 12.5, 0);
}

function ssjProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 0.10, 1);
    profile.addAttribute("PUNCH_DAMAGE", 14.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 12.5, 0);
}

function ssjchargeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 0.20, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.6, 0);
    profile.addAttribute("FALL_RESISTANCE", 12.5, 0);
}

function kameProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.70, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.6, 0);
    profile.addAttribute("FALL_RESISTANCE", 12.5, 0);
}

function getProfile(entity) {
    if (!entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:dyn/nanite_timer")) {
        return "SSJ";
    }
    else if (entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:dyn/nanite_timer")) {
        return "SSJCHARGE";
    }
    else if (entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:dyn/nanite_timer")) {
        return "BLADE";
    }
    else if (!entity.getData("fiskheroes:aiming") && entity.getData("fiskheroes:beam_charging")) {
        return "KAME";
    }
    return entity.getData("fiskheroes:aiming") ? "BB" : null;
}

function canAim(entity) {
    return !entity.isSneaking();
}

