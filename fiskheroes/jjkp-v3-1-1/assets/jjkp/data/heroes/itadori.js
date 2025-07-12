var utils = implement("fiskheroes:external/utils");
var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Yuji Itadori");
    hero.setTier(5);

    hero.setHelmet("Face");
    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPowers("jjkp:cursed_energy", "jjkp:enhanced_physiology", "jjkp:black_flash");

    hero.addAttribute("BASE_SPEED_LEVELS", 1.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);

    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 1);
    hero.addKeyBind("BLACK_FLASH", "Black Flash", 2);
    hero.addKeyBind("SUPER_SPEED", "Enhanced Speed", 3);
    hero.addKeyBind("SLOW_MOTION", "Enhanced Perception", 4);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("FLASH", flashProfile);

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
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ENERGY":
        return entity.getHeldItem().isEmpty();
    case "SUPER_SPEED":
        return !entity.getData("fiskheroes:mask_open");
    case "SLOW_MOTION":
        return !entity.getData("fiskheroes:mask_open");
    case "BLACK_FLASH":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 1;
    default:
        return true;
    }
}

function flashProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 17, 0);
}

function getProfile(entity) {
    if (entity.getData("jjkp:dyn/flash")) {
        return "FLASH";
    }
}