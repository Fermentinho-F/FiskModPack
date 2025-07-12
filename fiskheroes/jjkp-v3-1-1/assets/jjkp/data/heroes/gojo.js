var utils = implement("fiskheroes:external/utils");
var speedster_base = implement("fiskheroes:external/speedster_base");
var dome = implement("jjkp:external/domain");

function init(hero) {
    hero.setName("Satoru Gojo");
    hero.setTier(6);

    hero.setHelmet("Blindfold");
    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPowers("jjkp:lapse_blue", "jjkp:reversal_red", "jjkp:hollow_purple", "jjkp:six_eyes", "jjkp:limitless_toggle", "jjkp:infinite_void", "jjkp:reverse_cursed_technique");

    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBind("TELEKINESIS", "Lapse Blue", 1);
    hero.addKeyBind("CHARGED_BEAM", "Hollow Purple", 1);
    hero.addKeyBind("AIM", "Reversal Red", 2);
    hero.addKeyBind("REVERSE", "Reverse Cursed Technique", 2);
    hero.addKeyBind("LIMITLESS", "Limitless", 3);
    hero.addKeyBind("TELEPORT", "Teleport", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Space Manipulation", 4);
    hero.addKeyBind("SHADOWDOME", "Infinite Void", 4);
    hero.addKeyBind("SUPER_SPEED", "Enhanced Speed", 5);
    hero.addKeyBind("SLOW_MOTION", "Enhanced Perception", 5);

    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("DOMAIN", domainProfile);
    hero.setTierOverride(getTierOverride);

    hero.supplyFunction("canAim", canAim);

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);

        if (entity.getWornChestplate()) {
            manager.setData(entity, "jjkp:dyn/reset", dome.isEntityInTheirOwnDome(entity));
        }
    });
}

function getTierOverride(entity) {
    return entity.getData("jjkp:dyn/reset") ? 7 : 6;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return true;
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "ENERGY_PROJECTION":
        return !entity.getData("fiskheroes:mask_open") && (entity.getData("fiskheroes:energy_projection") || entity.getData("jjkp:dyn/space_manip_cooldown") == 0);
    case "SHADOWDOME":
        return entity.getData("fiskheroes:mask_open") && !entity.getData("jjkp:dyn/limitless");
    case "CHARGED_BEAM":
        return !entity.getData("jjkp:dyn/limitless") && entity.isSneaking() && entity.getData("fiskheroes:mask_open");
    case "AIM":
        return !entity.getData("jjkp:dyn/limitless") && !entity.isSneaking();
    case "TELEKINESIS":
        return !entity.getData("jjkp:dyn/limitless") && !entity.isSneaking();
    case "TELEPORT":
        return entity.getData("jjkp:dyn/limitless");
    case "REVERSE":
        return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting") && entity.isSneaking();
    case "SUPER_SPEED":
        return !entity.isSneaking();
    case "SLOW_MOTION":
        return entity.getData("fiskheroes:mask_open") && entity.isSneaking();
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:shadowdome":
        return entity.getData("fiskheroes:mask_open");
    case "fiskheroes:controlled_flight":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:charged_beam":
        return !entity.getData("jjkp:dyn/limitless") && entity.getData("fiskheroes:mask_open");
    case "fiskheroes:aim":
        return !entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:telekinesis":
        return !entity.getData("jjkp:dyn/limitless") && !entity.isSneaking();
    case "fiskheroes:water_breathing":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:healing_factor":
        return entity.getData("jjkp:dyn/reverse");
    case "fiskheroes:damage_weakness":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:potion_immunity":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:fire_immunity":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:projectile_immunity":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity":
        return entity.getData("jjkp:dyn/limitless");
        /*
    case "fiskheroes:damage_immunity|sharp":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|cursed":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|energy":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|electricity":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|cold":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|explosion":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|bullet":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|magic":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|shuriken":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:damage_immunity|sound":
        return entity.getData("jjkp:dyn/limitless");
        */
    default:
        return true;
    }
}

function domainProfile(profile) {
    //profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
    profile.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
}

function getProfile(entity) {
    if (entity.getData("jjkp:dyn/reset")) {
        return "DOMAIN";
    }
}