var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("iron man omega");
    hero.setTier(8);

    hero.setChestplate("armor");

    hero.addPowers("emo:iron_man_armor");
    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 80.0, 0);

    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("CHARGED_BEAM", "key.repulsorBeams", 2);
    hero.addKeyBind("HEAT_VISION", "Hand lazer", 3);
    hero.addKeyBind("BLADE", "Bad Blade", 4);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});


    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");
    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "fiskheroes:iron_man_walk");
    hero.addSoundOverrides("MK46", {
        "suit": {
            "MASK_OPEN": "fiskheroes:iron_man_mk46_mask_open",
            "MASK_CLOSE": "fiskheroes:iron_man_mk46_mask_close"
        }
    });

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

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.5, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 90.5, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}


function isModifierEnabled(entity, modifier) {
    return modifier.name() != "fiskheroes:water_breathing" || !entity.getData("fiskheroes:mask_open");
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    return true;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
