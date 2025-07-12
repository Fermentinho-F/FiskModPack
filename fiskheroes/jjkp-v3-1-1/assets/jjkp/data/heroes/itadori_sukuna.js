var utils = implement("fiskheroes:external/utils");
var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Yuji Itadori/Sukuna's Vessel");
    hero.setTier(5);

    hero.setHelmet("Face");
    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPowers("jjkp:cursed_energy", "jjkp:enhanced_physiology", "jjkp:black_flash");
    hero.addPowers("jjkp:sukuna_transformation", "jjkp:malevolent_shrine", "jjkp:cleave", "jjkp:reverse_cursed_technique");

    hero.addAttribute("BASE_SPEED_LEVELS", 1.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.25, 1);

    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 1);
    hero.addKeyBind("BLACK_FLASH", "Black Flash", 2);
    hero.addKeyBind("SUPER_SPEED", "Enhanced Speed", 3);
    hero.addKeyBind("SLOW_MOTION", "Enhanced Perception", 4);

    hero.addKeyBind("CHARGED_BEAM", "Cleave", 2);
    hero.addKeyBind("REVERSE", "Reverse Cursed Technique", 2);
    hero.addKeyBind("EARTHQUAKE", "Dismantle", 3);
    hero.addKeyBind("KITCHEN", "Malevolent Shrine", 4);
    hero.addKeyBind("SUKUNA_TRANSFORM", "Switch With Sukuna", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("FLASH", flashProfile);
    hero.addAttributeProfile("SUKUNA", sukunaProfile);
    hero.addAttributeProfile("SHRINE", shrineProfile);
    hero.setTierOverride(getTierOverride);

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:charge_energy":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:super_speed":
        return !entity.getData("fiskheroes:mask_open");
    case "fiskheroes:slow_motion":
        return !entity.getData("fiskheroes:mask_open");
    case "fiskheroes:charged_beam":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:healing_factor":
        return entity.getData("jjkp:dyn/reverse");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ENERGY":
        return entity.getHeldItem().isEmpty();
    case "SUPER_SPEED":
        return !entity.getData("fiskheroes:mask_open") && entity.isSneaking();
    case "SLOW_MOTION":
        return !entity.getData("fiskheroes:mask_open") && entity.isSneaking();
    case "BLACK_FLASH":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 1;
    case "KITCHEN":
        return entity.getData("jjkp:dyn/shrine_cooldown") == 0 && !entity.isSneaking() && entity.getData("jjkp:dyn/sukuna");
    case "SUKUNA_TRANSFORM":
        return !entity.getData("fiskheroes:mask_open");
    case "EARTHQUAKE":
        return entity.getData("jjkp:dyn/shrine") && entity.getData("jjkp:dyn/sukuna");
    case "CHARGED_BEAM":
        return entity.getHeldItem().isEmpty() && !entity.getInterpolatedData('fiskheroes:energy_charge') && !entity.isSneaking() && entity.getData("jjkp:dyn/sukuna");
    case "REVERSE":
        return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting") && entity.isSneaking() && !entity.getInterpolatedData('fiskheroes:energy_charge') && entity.getData("jjkp:dyn/sukuna");
    default:
        return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("jjkp:dyn/sukuna") ? 6 : 5;
}

function flashProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 17, 0);
}

function sukunaProfile(profile) {
    //profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.25, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 0.25, 1);
}
function shrineProfile(profile) {
    //profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("BASE_SPEED", -3.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -3.0, 1);
    profile.addAttribute("FALL_RESISTANCE", 0.25, 1);
}

function getProfile(entity) {
    if (entity.getData("jjkp:dyn/flash")) {
        return "FLASH";
    }
    if (entity.getData("jjkp:dyn/sukuna") && !entity.getData("jjkp:dyn/shrine")) {
        return "SUKUNA";
    }
    if (entity.getData("jjkp:dyn/sukuna") && entity.getData("jjkp:dyn/shrine")) {
        return "SHRINE";
    }
}