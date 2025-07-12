var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Legion Drone");
    hero.setAliases("legion", "ironlegion");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:iron_legion_armor");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.7, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    
    hero.addKeyBind("AIM", "key.aim", 1);
    
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);

    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "fiskheroes:iron_man_walk");
    
    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);
    });
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().isEmpty();
    }
    return true;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}