var utils = implement("fiskheroes:external/utils");
var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Sukuna");
    hero.setTier(6);

    hero.setHelmet("Face");
    hero.setChestplate("Chest");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPowers("jjkp:malevolent_shrine", "jjkp:king_curse_physiology", "jjkp:cleave", "jjkp:cursed_energy", "jjkp:reverse_cursed_technique");

    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.25, 1);

    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 1);
    hero.addKeyBind("CHARGED_BEAM", "Cleave", 2);
    hero.addKeyBind("REVERSE", "Reverse Cursed Technique", 2);
    hero.addKeyBind("SUPER_SPEED", "Enhanced Speed", 3);
    hero.addKeyBind("SLOW_MOTION", "Enhanced Perception", 4);
    hero.addKeyBind("EARTHQUAKE", "Dismantle", 3);
    hero.addKeyBind("KITCHEN", "Malevolent Shrine", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("SHRINE", shrineProfile);
    hero.setTierOverride(getTierOverride);

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:super_speed":
        return !entity.getData("jjkp:dyn/shrine");
    case "fiskheroes:slow_motion":
        return !entity.getData("fiskheroes:mask_open");
    case "fiskheroes:earthquake":
        return entity.getData("jjkp:dyn/shrine");
    case "fiskheroes:charged_beam":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:charge_energy":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:healing_factor":
        return entity.getData("jjkp:dyn/reverse");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SUPER_SPEED":
        return !entity.getData("jjkp:dyn/shrine");
    case "SLOW_MOTION":
        return !entity.getData("fiskheroes:mask_open");
    case "EARTHQUAKE":
        return entity.getData("jjkp:dyn/shrine");
    case "KITCHEN":
        return entity.getData("jjkp:dyn/shrine_cooldown") == 0 && !entity.isSneaking() && !entity.getInterpolatedData('fiskheroes:energy_charge');
    case "CHARGED_BEAM":
        return entity.getHeldItem().isEmpty() && !entity.getInterpolatedData('fiskheroes:energy_charge') && !entity.isSneaking();
    case "CHARGE_ENERGY":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting");
    case "REVERSE":
        return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:beam_shooting") && entity.isSneaking() && !entity.getInterpolatedData('fiskheroes:energy_charge');
    default:
        return true;
    }
}

function getTierOverride(entity) {
    return entity.getData("jjkp:dyn/shrine") ? 7 : 6;
}

function shrineProfile(profile) {
    //profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("BASE_SPEED", -3.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -3.0, 1);
    profile.addAttribute("FALL_RESISTANCE", 0.25, 1);
}

function getProfile(entity) {
    if (entity.getData("jjkp:dyn/shrine")) {
        return "SHRINE";
    }
}