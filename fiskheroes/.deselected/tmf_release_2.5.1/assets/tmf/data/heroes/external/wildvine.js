function init(hero) {
    hero.addKeyBind("0CHARGED_BEAM_WILDVINE", "Thorns", 1);

    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLES", "key.tentacles", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
    hero.addKeyBind("UTILITY_BELT", "Toggle Spore-Pods", 2);
    hero.addKeyBindFunc("func_WILDVINE", wildvineDigging, "Open/Close Flytrap", 3);
    hero.addKeyBindFunc("func_WILDVINE_CAMO", wildvineCamo, "Camouflage", 2);

    hero.addAttributeProfile("WILDVINE", profile => {
    profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    profile.addAttribute("SPRINT_SPEED", 0.1, 1);
    profile.addAttribute("WEAPON_DAMAGE", -1.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("WILDVINE_TENTACLES", profile => {
    profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    profile.addAttribute("SPRINT_SPEED", 0.1, 1);
    profile.addAttribute("WEAPON_DAMAGE", -1.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("WILDVINE_DIGGING", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("BASE_SPEED", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.3, 1);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 0);
        profile.addAttribute("STEP_HEIGHT", 2.0, 0);
        profile.addAttribute("MAX_HEALTH", -2, 0);
        });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var block = entity.world().blockAt(entity.pos().add(0, -1.0, 0)).name();	
    var blocks = (block == 'minecraft:dirt' || block == 'minecraft:stone' || block == 'minecraft:sandstone' || block == 'minecraft:sand' || block == 'minecraft:grass' || block == 'minecraft:cobblestone');	
    var blocksNeg = (block != 'minecraft:dirt' && block != 'minecraft:stone' && block != 'minecraft:sandstone' && block != 'minecraft:sand' && block != 'minecraft:grass' && block != 'minecraft:cobblestone');	
    manager.incrementData(entity, "tmf:dyn/pt_1", 10, entity.getData('tmf:dyn/p_1'));
    manager.incrementData(entity, "tmf:dyn/pt_3", 10, entity.getData('tmf:dyn/p_3'));

    if (blocksNeg) {
        manager.setData(entity, "tmf:dyn/p_1", false);
        manager.setData(entity, 'fiskheroes:heat_vision', false);
    }
    if (!entity.getData('tmf:dyn/p_1')) {
        manager.setData(entity, "tmf:dyn/p_3", false);
    }
}

function getAttributeProfile(entity) {
    return entity.getData('fiskheroes:tentacle_extend_timer') == 0 ? (entity.getData('tmf:dyn/pt_1') == 0 ? "WILDVINE" : "WILDVINE_DIGGING") : "WILDVINE_TENTACLES";
}

function isModifierEnabled(entity, modifier) {
    if (modifier.id() == "wildvine_1") {
        return !entity.isWet();
    }
    if (modifier.id() == "wildvine_2") {
        return entity.isWet();
    }
    if (modifier.id() == "wildvine_12") {
        return entity.getData('fiskheroes:tentacle_extend_timer') == 0 && !entity.getData('tmf:dyn/p_1');
    }
    if (modifier.id() == "wildvine_14") {
        return true;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("wildvine");

    if (keyBind == "0CHARGED_BEAM_WILDVINE") {
        return SL >= 60 && entity.getData('fiskheroes:tentacle_extend_timer') != 1 && !entity.isSneaking() && entity.getData('tmf:dyn/pt_1') == 0;
    }

    if (keyBind == "CHARGED_BEAM") {
        return SL >= 60 && entity.getData('fiskheroes:tentacle_extend_timer') != 1 && !entity.isSneaking() && entity.getData('tmf:dyn/pt_1') == 0;
    }
    if (keyBind == "TENTACLE_JAB") {
        return entity.getData('fiskheroes:tentacle_extend_timer') == 1 && !entity.isSneaking();
    }
    if (keyBind == "TENTACLE_GRAB") {
        return entity.getData('fiskheroes:tentacle_extend_timer') == 1;
    }
    if (keyBind == "TENTACLES") {
        return SL >= 15 && entity.isSneaking() && entity.getData('tmf:dyn/pt_1') == 0;
    }
    if (keyBind == "UTILITY_BELT") {
        return entity.getData('fiskheroes:tentacle_extend_timer') == 0 && entity.getData('tmf:dyn/pt_1') == 0;
    }
    if (keyBind == "func_WILDVINE") {
        return SL >= 60 && entity.getData('fiskheroes:tentacle_extend_timer') == 0;
    }

    if (keyBind == "func_WILDVINE_CAMO") {
        return entity.getData('tmf:dyn/pt_1') == 1 && (entity.getData('tmf:dyn/pt_3') == 1 || entity.getData('tmf:dyn/pt_3') == 0);
    }
    return false;
}

function hasProperty(entity, property) {
    return false;
}

function getDefaultScale(entity) {
    return 1 + 0.2*entity.getInterpolatedData('tmf:dyn/transformation_timer') - 0.7*entity.getInterpolatedData('tmf:dyn/pt_1');
}

function getTierOverride(entity) {
    return 5;
}

function wildvineDigging(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", !player.getData('tmf:dyn/p_1'));
    manager.setData(player, 'fiskheroes:heat_vision', player.getData('tmf:dyn/p_1'));
    player.playSound("tmf:wildvine.growing", 1, 0.9 + 0.2 * Math.random());
    return true;
}

function wildvineCamo(player, manager) {
    if (!player.getData('tmf:dyn/p_3')) {
        var flowerType = [0, 1, 2, 3];
        var randomFlower = flowerType[Math.floor(Math.random() * flowerType.length)];
    
        manager.setDataWithNotify(player, 'tmf:dyn/pc_1', randomFlower);
    }
    manager.setData(player, "tmf:dyn/p_3", !player.getData('tmf:dyn/p_3'));
    player.playSound("tmf:wildvine.growing", 0.7, 0.9 + 0.2 * Math.random());
    return true;
}