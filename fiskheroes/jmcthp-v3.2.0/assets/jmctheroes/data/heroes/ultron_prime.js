function init(hero) {
    hero.setName("Ultron Prime");
    hero.setAliases("ultronmk2");
    hero.setTier(7);
    
    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");
    
    hero.addPowers("jmctheroes:prime_armor");
    hero.addAttribute("PUNCH_DAMAGE", 9.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", -0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 9.0, 0);
    
    hero.addKeyBind("AIM", "key.energyProjection", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Energy Beams", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    
    hero.setDefaultScale(1.1);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);

    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "fiskheroes:manta_walk");
    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
    });
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    switch (keyBind) {
    case "ENERGY_PROJECTION":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:telekinesis") && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aimed_timer") > 0.7;
    case "AIM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:telekinesis");
    case "TELEKINESIS":
        return entity.getHeldItem().isEmpty();
    }
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:energy_projection":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:telekinesis");
    case "fiskheroes:telekinesis":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
