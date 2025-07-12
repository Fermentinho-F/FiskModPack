var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("War Machine/Mark 3");
    hero.setAliases("warmk3", "wmmk3");
    hero.setTier(7);hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jmctheroes:warhammer, display:{Lore:[\"\u00A75\u00A7lJMCT Heroes\u00A7r\"]}, AttributeModifiers:[{Operation:0,UUIDLeast:1,UUIDMost:1,Amount:7,AttributeName:generic.attackDamage,Name:Sword}]}", true, item => item.nbt().getString("WeaponType") == "jmctheroes:warhammer");
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:war_machine_armor_mk3");
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    
    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("CHARGED_BEAM", "Shoulder Turrent", 2);
    hero.addKeyBind("HEAT_VISION", "Hand Guns", 3);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 5);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasPermission(hasPermission);
    hero.setHasProperty(hasProperty);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");
    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "fiskheroes:iron_man_walk");
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:suit_open") && entity.getData("jmctheroes:dyn/suit_open") < 1 && !entity.is("PLAYER")) {
        manager.setData(entity, "jmctheroes:dyn/suit_open", entity.getData("jmctheroes:dyn/suit_open") + 0.2)
        }
        if (!entity.getData("fiskheroes:suit_open") && entity.getData("jmctheroes:dyn/suit_open") > 0) {
        manager.setData(entity, "jmctheroes:dyn/suit_open", entity.getData("jmctheroes:dyn/suit_open") - 0.05)
        }
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());
        landing.tick(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:water_breathing") {
        return !entity.getData("fiskheroes:mask_open");
    }
    if (modifier.name() == "fiskheroes:charged_beam") {
        return !entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:aiming");
    }
    if (modifier.name() == "fiskheroes:heat_vison") {
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying");
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:beam_shooting_timer");
    case "CHARGED_BEAM":
        return !entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:aiming");
    case "HEAT_VISION":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:aiming") && !(!entity.getData("fiskheroes:heat_vision") && entity.getData("jmctheroes:dyn/suit_cooldown") > 0);
    }
    return true;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:beam_shooting_timer");
}
function hasPermission(entity, permission) {
    return permission == "USE_WARHAMMER";
}