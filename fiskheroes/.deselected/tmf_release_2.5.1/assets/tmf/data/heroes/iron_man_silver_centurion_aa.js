function init(hero) {
    hero.setName("Iron Man");
    hero.setVersion("Silver Centurion");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");


    hero.addPowers("tmf:iron_man_silver_centurion_armor");
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("SHIELD", "key.shield", 2);
    hero.addKeyBind("CHARGED_BEAM", "Unibeam", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("UNIBEAM", unibeamProfile);
    hero.setAttributeProfile(getAttributeProfile);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");
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

        var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

        if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.25 && entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
            manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
            entity.playSound("fiskheroes:mob.ironman.hurt", 1, 0.8 + Math.random() * 0.2);
        }
        else if (t > 0) {
            manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
        }

        manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
    });
}

function unibeamProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.0, 1);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {

        case "fiskheroes:shield":
            return !entity.getData('fiskheroes:flying');
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open");
        default:
            return true;
    }
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:shield_blocking_timer") ? "UNIBEAM" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    else if (keyBind == "AIM") {
        return !entity.getData("fiskheroes:beam_charging");
    }
    else if (keyBind == "SHIELD") {
        return !entity.getData("fiskheroes:beam_charging");
    }
    return true;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData('fiskheroes:shield_blocking_timer')  && !entity.getData('fiskheroes:beam_charging');
}
