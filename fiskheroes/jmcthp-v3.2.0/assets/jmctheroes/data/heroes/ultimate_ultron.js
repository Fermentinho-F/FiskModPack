function init(hero) {
    hero.setName("Ultimate Ultron");
    hero.setAliases("ultronmk3", "juicedUltron");
    hero.setTier(8);
    
    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");
    
    hero.addPowers("jmctheroes:ultimate_armor");
    hero.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", -1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 9.0, 0);
    
    hero.addKeyBind("AIM", "key.energyProjection", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Energy Beams", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    hero.addKeyBind("BLADE", "Heat Generation", 3);
    
    hero.setDefaultScale(1.25);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);

    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "fiskheroes:manta_walk");
    hero.setDamageProfile(entity => entity.getData("fiskheroes:blade") ? "HEAT_PUNCH" : null);
    hero.addDamageProfile("HEAT_PUNCH", {
        "types": {"BLUNT": 1.0, "FIRE": 0.7 },
        "properties": {"HEAT_TRANSFER": 60,"IGNITE": 4}
    });
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
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:blade") && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData("fiskheroes:aimed_timer") > 0.7;
    case "AIM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:blade");
    case "TELEKINESIS":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:blade");
    case "BLADE":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying");
    }
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:energy_projection":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:blade");;
    case "fiskheroes:telekinesis":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:blade");;
    case "fiskheroes:blade":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying");
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
