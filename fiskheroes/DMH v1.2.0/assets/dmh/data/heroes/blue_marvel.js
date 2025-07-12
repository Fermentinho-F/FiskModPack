function init(hero) {
    hero.setName("Blue Marvel");
    hero.setVersion("Adam Brashear")
    hero.setAliases("Adam Brashear")
    hero.setTier(10);

    hero.setHelmet("Head");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("dmh:anti_matter_manipulation", "dmh:anti_matter_energy_absorption_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.20, 1);
    hero.addAttribute("MAX_HEALTH", 10.0, 0);

    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("AIM_VISUAL", "\u00A7mAim", 1);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 3);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A7mTelekinesis", 3);
    hero.addKeyBind("CHARGE_ENERGY", "Charge Energy Punch", 4);
    hero.addKeyBind("CHARGE_ENERGY_VISUAL", "\u00A7mCharge Energy Punch", 4);
    hero.addKeyBind("ENERGY_PROJECTION", "Anti-Matter Beam", 2);
    hero.addKeyBind("ENERGY_PROJECTION_VISUAL", "\u00A7mAnti-Matter Beam", 2);
    hero.addKeyBind("SHIELD", "Forcefield", 5);
    hero.addKeyBind("SHIELD_VISUAL", "\u00A7mForcefield", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.supplyFunction("canDischargeEnergy", false);
    hero.addAttributeProfile("ENERGY_INFUSION", energyinfusionProfile);
    hero.setAttributeProfile(getProfile);
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "AIM":
        return !entity.getData("fiskheroes:energy_projection");
    case "AIM_VISUAL":
        return entity.getData("fiskheroes:energy_projection");
    case "TELEKINESIS":
        return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:shield");
    case "TELEKINESIS_VISUAL":
        return entity.getData("fiskheroes:energy_projection") || entity.getData("fiskheroes:shield");
    case "CHARGE_ENERGY":
        return !entity.getData("fiskheroes:energy_projection");
    case "CHARGE_ENERGY_VISUAL":
        return entity.getData("fiskheroes:energy_projection");
    case "ENERGY_PROJECTION":
        return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:shield");
    case "ENERGY_PROJECTION_VISUAL":
        return entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:shield");
    case "SHIELD":
        return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:telekinesis");
    case "SHIELD_VISUAL":
        return entity.getData("fiskheroes:energy_projection") || entity.getData("fiskheroes:telekinesis");
    default:
        return true;
    }
}


function getProfile(entity) {
    if (entity.getData("fiskheroes:energy_charge")){
        return "ENERGY_INFUSION"
    }
    return true;

}

function energyinfusionProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);

}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
