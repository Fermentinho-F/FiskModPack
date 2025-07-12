function init(hero) {
    hero.addKeyBind("SNARE_OH", "Charged Punch", 1);

    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLES", "key.tentacles", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2)
    hero.addKeyBindFunc("func_SNARE_OH", snareOhKey, "Bandage Form", 4);

    hero.addAttributeProfile("SNARE_OH", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("BASE_SPEED", -0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("MAX_HEALTH", -3, 0);
    });
    hero.addAttributeProfile("SNARE_OH_BANDAGE", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("BASE_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
    });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var P1 = entity.getData("tmf:dyn/p_1");
    var PC1 = entity.getData("tmf:dyn/pc_1");
    var PT3 = entity.getData("tmf:dyn/pt_3");
    var TENTACLES = entity.getData("fiskheroes:tentacle_extend_timer");
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("snare_oh");
    manager.incrementData(entity, "tmf:dyn/pt_1", 24, 24, P1, !P1);
    manager.incrementData(entity, "tmf:dyn/pc_1", 1000, 500, P1, !P1);

    manager.incrementData(entity, "tmf:dyn/pt_3", 20, SL >= 60 && TENTACLES == 0 && (!entity.isOnGround() && entity.motionY() < -0.15) ? 1 : 0);

    if (PT3 == 1 && !P1) {
        manager.setData(entity, 'tmf:dyn/p_1', true);
        entity.playSound("tmf:snareOh.transform", 1, 0.9 + 0.2 * Math.random());
    }
    if (PC1 == 1) {
        manager.setData(entity, 'tmf:dyn/p_1', false);
        entity.playSound("tmf:snareOh.transform", 1, 0.9 + 0.2 * Math.random());
    }

}

function getAttributeProfile(entity) {
    return entity.getData("tmf:dyn/pt_1") == 0 ? "SNARE_OH" : "SNARE_OH_BANDAGE";
}

function isModifierEnabled(entity, modifier) {
    var PT1 = entity.getData("tmf:dyn/pt_1");

    if (modifier.id() == "snare_oh_1") {
        return  (PT1 == 1);
    }

    return true; 
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("snare_oh");
    var PT1 = entity.getData("tmf:dyn/pt_1");
    var TENTACLES = entity.getData("fiskheroes:tentacle_extend_timer");

    if (keyBind == "SNARE_OH") {
        return PT1 == 0 && !entity.isSneaking() && TENTACLES == 0;
    }
    if (keyBind == "CHARGED_BEAM") {
        return PT1 == 0 && !entity.isSneaking() && TENTACLES == 0;
    }
    if (keyBind == "TENTACLES") {
        return PT1 == 0 && entity.isSneaking() && SL >= 15;
    }

    if (keyBind == "TENTACLE_JAB") {
        return TENTACLES == 1 && !entity.isSneaking();
    }
    if (keyBind == "TENTACLE_GRAB") {
        return TENTACLES == 1;
    }

    if (keyBind == "func_SNARE_OH") {
        return TENTACLES == 0 && SL >= 60;
    }
    return false;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function getDefaultScale(entity) {
    return 1 + 0.4*entity.getInterpolatedData('tmf:dyn/transformation_timer') - entity.getInterpolatedData("tmf:dyn/pt_1");
}

function getTierOverride(entity) {
    return 5;
}

function snareOhKey(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", !player.getData('tmf:dyn/p_1'));
    player.playSound("tmf:snareOh.transform", 1, 0.9 + 0.2 * Math.random());
    return true;
}
