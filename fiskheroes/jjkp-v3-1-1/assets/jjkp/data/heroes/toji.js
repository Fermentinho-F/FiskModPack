var utils = implement("fiskheroes:external/utils");
var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Toji Fushiguro");
    hero.setTier(6);

    hero.setHelmet("Face");
    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jjkp:heaven_spear}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jjkp:split_soul_katana}", true);
    hero.setHasPermission((entity, permission) => permission === "USE_SWORD");

    hero.addPowers("jjkp:heavenly_restriction");

    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 7.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.5, 1);

    hero.addKeyBind("SUPER_SPEED", "Enhanced Speed", 1);
    hero.addKeyBind("SLOW_MOTION", "Enhanced Perception", 2);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("SPEAR", spearProfile);
    hero.addAttributeProfile("SPLIT", splitProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("CANCEL", {
        "types": {
            "CANCEL": 1.0
        }
    });
    hero.addDamageProfile("SOUL", {
        "types": {
            "SHARP": 0.9,
            "CURSED": 0.5
        }
    });

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
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

function getDamageProfile(entity) {
    if (entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == "jjkp:split_soul_katana") {
        return "SOUL";
    }
    if (entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == "jjkp:heaven_spear") {
        return "CANCEL";
    }
}

function spearProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
}

function splitProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 14, 0);
}

function getProfile(entity) {
    if (entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == "jjkp:heaven_spear") {
        return "SPEAR";
    }
    if (entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == "jjkp:split_soul_katana") {
        return "SPLIT";
    }
}