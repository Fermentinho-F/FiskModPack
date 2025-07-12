function init(hero) {
    
    hero.addKeyBind("SUPER_SPEED", "Super Speed", 1);
    hero.addKeyBind("SLOW_MOTION", "Accelerated Perception", 2);
    hero.addKeyBindFunc("func_POWER_SLIDE", powerSlideKey, "Power Slide", 3);
    hero.addKeyBind("FAST_PUNCH", "Fast Punch", 4);

    hero.addDamageProfile("XLR8", {
        "types": {
            "BLUNT": 1.0,
            "SHARP": 0.55
        },
        "properties": {
            "HIT_COOLDOWN": 5
        }
    });

    hero.addAttributeProfile("XLR8", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
        profile.addAttribute("WEAPON_DAMAGE", 1.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 0.6, 1);
        profile.addAttribute("SPRINT_SPEED", 0.6, 1);
        profile.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
        profile.addAttribute("MAX_HEALTH", -4, 0);
    });
    hero.addAttributeProfile("XLR8_SLIDE", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
        profile.addAttribute("WEAPON_DAMAGE", 1.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", -1, 1);
        profile.addAttribute("SPRINT_SPEED", -0.6, 1);
        profile.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);
        profile.addAttribute("MAX_HEALTH", -4, 0);
    });

    hero.addAttributeProfile("XLR8_MASK", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
        profile.addAttribute("WEAPON_DAMAGE", 1.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 0.6, 1);
        profile.addAttribute("SPRINT_SPEED", 0.6, 1);
        profile.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);
        profile.addAttribute("MAX_HEALTH", -4, 0);
    });

	hero.addSoundEvent("MASK_OPEN", "tmf:xlr8_mask");
	hero.addSoundEvent("MASK_CLOSE", "tmf:xlr8_mask");

}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("xlr8");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var flight = entity.getData("fiskheroes:flying");

        manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") && entity.getData("fiskheroes:speed") > 1);
        manager.incrementData(entity, "tmf:dyn/pt_1", 7, entity.motionY() > 0.1 ? 1 : 0 );

        if (entity.getData('tmf:dyn/p_1')) {
            if (!entity.getData('fiskheroes:heat_vision')) {
                entity.playSound("tmf:xlr8.slide", 1, 0.6 + 0.2 * Math.random());
            }
            manager.setData(entity, 'fiskheroes:heat_vision', true);
            manager.incrementData(entity, "tmf:dyn/pc_1", 15, true);
            if (entity.getData('tmf:dyn/pc_1') == 1) {
                manager.setData(entity, "tmf:dyn/p_1", false);
                manager.setData(entity, "tmf:dyn/pc_1", 0);
                manager.setData(entity, 'fiskheroes:heat_vision', false);
            }
        }
        if (entity.getData('tmf:dyn/xlrate_punch')) {
            manager.setData(entity, 'fiskheroes:heat_vision', true);
        }
        if (!entity.getData('tmf:dyn/xlrate_punch') && entity.getData('tmf:dyn/xlrate_punch_timer') != 0) {
            manager.setData(entity, 'fiskheroes:heat_vision', false);
        }

}

function powerSlideKey(player, manager) {
	
    manager.setData(player, "tmf:dyn/p_1", true);

    return true;
}

function getAttributeProfile(entity) {
    return entity.getData('tmf:dyn/pc_1') > 0.4 ? "XLR8_SLIDE" : (entity.getData('fiskheroes:mask_open') ? "XLR8_MASK" : "XLR8");
}

function getDamageProfile(entity) {
    return entity.getHeldItem().isEmpty() ? "XLR8" : null;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.id() == "xlr8_6") {
        return !entity.getData('tmf:dyn/p_1');
    }
    if (modifier.id() == "xlr8_5") {
        return entity.getData('tmf:dyn/p_1');
    }
    if (modifier.id() == "xlr8_8") {
        return entity.isInWater() && entity.getData("fiskheroes:speed") >= 4 && entity.world().getBlock(entity.pos().add(0, 0.5, 0)) != 'minecraft:water';
    }
    if (modifier.id() == "xlr8_9") {
        return entity.getData("fiskheroes:speed") >= 3;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("xlr8");
    if (keyBind == "SUPER_SPEED") {
        return true;
    }
    if (keyBind == "FAST_PUNCH") {
        return !entity.isSneaking() && entity.getHeldItem().isEmpty() && SL == 60;
    }
    if (keyBind == "SLOW_MOTION") {
        return SL >= 15;
    }
    if (keyBind == "func_POWER_SLIDE") {
        return Math.sqrt(Math.pow(entity.motionX(),2) + Math.pow(entity.motionZ(), 2)) > 2 && SL == 60;
    }
    return false;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";;
}

function getDefaultScale(entity) {
    return 1 - 0.2*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 4;
}
