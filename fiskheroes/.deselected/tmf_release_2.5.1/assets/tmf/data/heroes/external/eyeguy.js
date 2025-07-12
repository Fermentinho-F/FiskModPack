function init(hero) {
    hero.addKeyBind("HEAT_VISION_EYEGUY", "Fire Beams", 1); 
    hero.addKeyBind("AIM_EYEGUY", "Energy Blast", 1);

    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("HEAT_VISION", "Aim", 1); 
    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBindFunc("func_EYEGUY_ICE_BURST", eyeguyIceBurstKey, "Cold Burst", 4);
    hero.addKeyBindFunc("func_EYEGUY_ABILITY_SWITCH", eyeguySwitchKey, "Switch Abilities", 2);

    hero.addAttributeProfile("EYEGUY", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });
    hero.addAttributeProfile("EYEGUY_SHOOTING", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 4, 1);
        profile.addAttribute("BASE_SPEED", -0.5, 1);
        profile.addAttribute("JUMP_HEIGHT", -10, 0);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    
    if (!entity.getData("fiskheroes:beam_charging") && entity.getData("tmf:dyn/p_1")) {
        manager.setData(entity, "fiskheroes:flying", false);
        manager.setData(entity, "tmf:dyn/p_1", false);
    }

    manager.incrementData(entity, "fisktag:dyn/leap_cooldown", entity.getData("tmf:dyn/p_1") ? 40 : 60, false);

    manager.incrementData(entity, "tmf:dyn/pt_1", 6, entity.getData("fiskheroes:heat_vision"));
    manager.incrementData(entity, "tmf:dyn/pc_1", 6, entity.getData("fiskheroes:beam_shooting_timer") && !entity.getData("tmf:dyn/p_3"));
    manager.incrementData(entity, "tmf:dyn/pc_3", 20, entity.getData("fiskheroes:beam_charge") && entity.getData("tmf:dyn/p_3"));

    if (entity.getData("fiskheroes:flying") && !entity.getData('tmf:dyn/p_1')) {
        manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
    }

}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:beam_charging") ? "EYEGUY_SHOOTING" : "EYEGUY";
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ditto");
    var leapCooldown = entity.getData('fisktag:dyn/leap_cooldown');
    var PT1 = entity.getData('tmf:dyn/pt_1');
    var P1 = entity.getData('tmf:dyn/p_1');
    var P3 = entity.getData('tmf:dyn/p_3');
    var PC3 = entity.getData('tmf:dyn/pc_3');

    if (modifier.id() == "eyeguy_0") {
        return entity.isSprinting() && leapCooldown == 0 && !P1;
    }
    if (modifier.id() == "eyeguy_1") {
        return leapCooldown == 0 && PT1 != 1;
    }
    if (modifier.id() == "eyeguy_2") {
        return leapCooldown == 0 && PT1 == 1;
    }
    if (modifier.id() == "eyeguy_3") {
        return P1 && !P3;
    }
    if (modifier.id() == "eyeguy_4") {
        return P1;
    }
    if (modifier.id() == "eyeguy_6") {
        return !P1 && P3 && leapCooldown == 0 && PC3 != 1;
    }
    if (modifier.id() == "eyeguy_7") {
        return !P1 && P3 && leapCooldown == 0 && PC3 == 1;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("eyeguy");
    var P1 = entity.getData('tmf:dyn/p_1');
    var P3 = entity.getData('tmf:dyn/p_3');
    var leapCooldown = entity.getData('fisktag:dyn/leap_cooldown');
    var mask = entity.getData('fiskheroes:mask_open_timer2');

    if (keyBind == "HEAT_VISION_EYEGUY") {
        return !P1 && mask != 1 && !P3;
    }
    if (keyBind == "AIM_EYEGUY") {
        return !P1 && mask == 1;
    }

    if (keyBind == "func_EYEGUY_ABILITY_SWITCH") {
        return !P1 && mask != 1 && SL >= 15;
    }
    if (keyBind == "CHARGED_BEAM") {
        return !P1 && mask != 1 && P3 && leapCooldown == 0;
    }
    if (keyBind == "HEAT_VISION") {
        return !P1 && mask != 1 && !P3;
    }
    if (keyBind == "func_EYEGUY_ICE_BURST") {
        return leapCooldown > 0.8 && entity.getData("fiskheroes:beam_charging") == 0 && SL >= 60;
    }

    return false;
}

function canAim(entity) {
    return !entity.getData('tmf:dyn/p_1') && entity.getData('fiskheroes:mask_open_timer2') == 1;
}


function getDefaultScale(entity) {
    return 1 + 0.2*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function hasProperty(entity, property) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("eyeguy");
    return SL >= 15 ?  property == "MASK_TOGGLE" : false;
}

function getTierOverride(entity) {
        return 6;
}

function eyeguyIceBurstKey(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", true);
    manager.setData(player, "fiskheroes:beam_charging", true);
    manager.setData(player, "fiskheroes:flying", true);
    return true;
}
function eyeguySwitchKey(player, manager) {
    manager.setData(player, "tmf:dyn/p_3", !player.getData("tmf:dyn/p_3"));
    return true;
}