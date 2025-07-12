function init(hero) {
    hero.setName("Star-Lord");
    hero.setAliases("quill");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.trenchcoat");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:quadblaster", "jmctheroes:jet_boots");
    hero.addAttribute("PUNCH_DAMAGE", 3.2, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.7, 1);
    
    hero.addKeyBind("AIM", "key.aim", 1);
    
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);
        if (entity.getData("fiskheroes:aiming")) {
            manager.setData(entity,"jmctheroes:dyn/random_repulsor", Math.ceil(Math.random() * 4))
        }
        if (!entity.getData("fiskheroes:aiming") && entity.getData("jmctheroes:dyn/random_repulsor") != 0) {
            manager.setData(entity,"jmctheroes:dyn/random_repulsor", 0)
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flight_boost_timer") == 1;
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:water_breathing" || !entity.getData("fiskheroes:mask_open");
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}