var utils = implement("fiskheroes:external/utils");
var speedster_base = implement("fiskheroes:external/speedster_base");
var dome = implement("jjkp:external/domain");

function init(hero) {
    hero.setName("Jogoat");
    hero.setTier(9);

    hero.setHelmet("Head");
    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPowers("jjkp:cursed_energy", "jjkp:disaster_flames", "jjkp:true_king_curse_physiology", "jjkp:infinite_volcano", "jjkp:limitless_toggle", "jjkp:black_flash", "jjkp:six_eye");

    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 12.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 1);
    hero.addKeyBind("BLACK_FLASH", "Black Flash", 2);
    hero.addKeyBind("AIM", "Flame Blast", 2);
    hero.addKeyBind("SHADOWDOME", "Infinite Volcano", 4);
    hero.addKeyBind("LIMITLESS", "Limitless", 3);
    hero.addKeyBind("TELEPORT", "Teleport", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Space Manipulation", 4);
    hero.addKeyBind("SUPER_SPEED", "Enhanced Speed", 5);
    hero.addKeyBind("SLOW_MOTION", "Enhanced Perception", 5);

    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("DOMAIN", domainProfile);
    hero.setTierOverride(getTierOverride);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("FLASH", flashProfile);

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);

        if (entity.getWornChestplate()) {
        manager.setData(entity, "jjkp:dyn/reset", dome.isEntityInTheirOwnDome(entity));
        }
    });
}

function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return true;
        default:
            return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:charge_energy":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:fireball":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 0;
    case "fiskheroes:flame_blast":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 0;

    case "fiskheroes:shadowdome":
        return entity.getData("fiskheroes:mask_open");
    case "fiskheroes:controlled_flight":
        return entity.getData("jjkp:dyn/limitless");
    case "fiskheroes:water_breathing":
        return entity.getData("jjkp:dyn/limitless");
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
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ENERGY":
        return entity.getHeldItem().isEmpty() && !entity.getData("jjkp:dyn/limitless") && !entity.getData("fiskheroes:aiming");
    case "BLACK_FLASH":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 1 && !entity.getData("jjkp:dyn/reset");
    case "AIM":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 0;
    case "SHADOW_DOME":
        return !entity.isSneaking();
    case "SUPER_SPEED":
        return !entity.isSneaking();
    case "SLOW_MOTION":
        return entity.isSneaking();
    case "TELEPORT":
        return entity.getData("jjkp:dyn/limitless");
    case "SHADOWDOME":
        return entity.getData("fiskheroes:mask_open") && !entity.getData("jjkp:dyn/limitless");
    case "ENERGY_PROJECTION":
        return !entity.getData("fiskheroes:mask_open") && (entity.getData("fiskheroes:energy_projection") || entity.getData("jjkp:dyn/space_manip_cooldown") == 0);
    default:
        return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("jjkp:dyn/reset") ? 10 : 9;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 0;
}

function domainProfile(profile) {
    //profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 3.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
}

function flashProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 17, 0);
}

function getProfile(entity) {
    if (entity.getData("jjkp:dyn/reset")) {
        return "DOMAIN";
    }
    if (entity.getData("jjkp:dyn/flash")) {
        return "FLASH";
    }
}