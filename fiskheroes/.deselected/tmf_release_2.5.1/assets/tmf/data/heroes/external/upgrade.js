function init(hero) {
    hero.addKeyBind("0CHARGED_BEAM_UPGRADE_1", "Unleash Toxic Fumes", 1);
    hero.addKeyBind("0CHARGED_BEAM_UPGRADE_2", "Push", 1);
    hero.addKeyBind("0HEAT_VISION_UPGRADE_1", "Sonic Blast", 1);

    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLES", "key.tentacles", 1);
    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("HEAT_VISION", "Aim", 1);
    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("UPGRADE_LIQUID", "Liquify", 2);
    hero.addKeyBindFunc("func_UPGRADE", upgradeKey, "Upgrade", 3);
    hero.addKeyBind("SHIELD", "key.forcefield", 2);
    hero.addKeyBindFunc("func_UPGRADE_FLIGHT_BOOST", upgradeFlightBoostKey, "Flight Boost", 1);

    hero.addAttributeProfile("UPGRADE", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("KNOCKBACK", 1, 0);
        profile.addAttribute("BASE_SPEED", -0.05, 1);
    });

    hero.addAttributeProfile("UPGRADE_LIQUID", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        //profile.addAttribute("REACH_DISTANCE", -1.0, 1);
        profile.addAttribute("BASE_SPEED", -0.08, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    });

    hero.addAttributeProfile("UPGRADE_SPEAKER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        //profile.addAttribute("REACH_DISTANCE", -1.0, 1);
        profile.addAttribute("BASE_SPEED", -10.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    });

    hero.addAttributeProfile("UPGRADE_ANVIL", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        //profile.addAttribute("REACH_DISTANCE", -1.0, 1);
        profile.addAttribute("BASE_SPEED", -1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", 2.0, 1);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("IMPACT_DAMAGE", 3.0, 1);
    });
    hero.addAttributeProfile("UPGRADE_GAS_CHAMBER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        //profile.addAttribute("REACH_DISTANCE", -1.0, 1);
        profile.addAttribute("BASE_SPEED", -0.1, 1);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    });

    hero.addAttributeProfile("UPGRADE_MK50", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", 0.75, 0);
    });
}

function getDefaultScale(entity) {
    var liquifiedTimer = entity.getInterpolatedData('tmf:dyn/upgrade_liquified_timer');
    var upgrade = entity.getData("tmf:dyn/upgrade");
    return 1.0 - (upgrade == "fiskheroes:superhero_chestplate" ? 0 : upgrade == "minecraft:piston" ? 0.35 * liquifiedTimer : (upgrade == "minecraft:noteblock" ? -0.3 * liquifiedTimer : (upgrade == "minecraft:anvil" ? + 0.2 * liquifiedTimer : (upgrade == "fiskheroes:masonry_oven" ? - 0.3 * liquifiedTimer : 0.9 * liquifiedTimer))));
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }

    var nbt = entity.getWornChestplate().nbt();
    var SL = nbt.getByte("upgrade");
    var PT1 = entity.getData('tmf:dyn/pt_1');
    var PC1 = entity.getData('tmf:dyn/pt_1');
    var gliding = entity.getData("fiskheroes:gliding");
    var upgrade = entity.getData("tmf:dyn/upgrade");
    var flying = entity.getData("fiskheroes:flying");
    var liquidTimer = entity.getData('tmf:dyn/upgrade_liquified_timer');

    manager.incrementData(entity, "tmf:dyn/pt_1", 20, (!gliding && !entity.isOnGround() && entity.motionY() < -0.15) ? 1 : 0);

    manager.incrementData(entity, "tmf:dyn/pt_2", 4, entity.motionY() > 0.1 ? 1 : 0);

    if (PT1 == 1) {
        manager.setData(entity, 'tmf:dyn/upgrade_liquified', true);
    }

    if (upgrade == 'fiskheroes:masonry_oven') {
        manager.incrementData(entity, "tmf:dyn/pc_2", 20, entity.getData("fiskheroes:shooting"));
    }
    if (entity.getData("fiskheroes:shooting") && PC1 != 1 && upgrade == 'fiskheroes:masonry_oven') {
        manager.incrementData(entity, "tmf:dyn/pc_1", 600, 1);
    }
    if (entity.getData("fiskheroes:beam_shooting_timer") == 1 && PC1 != 1 && upgrade == 'fiskheroes:masonry_oven') {
        manager.incrementData(entity, "tmf:dyn/pc_1", 60, 0);
        manager.setData(entity, 'tmf:dyn/p_1', true);
    }
    if (!entity.getData("fiskheroes:beam_shooting_timer") == 1 || entity.getData("tmf:dyn/pc_1") == 0) {
        manager.setData(entity, 'tmf:dyn/p_1', false);
    }
    if (upgrade != null && (liquidTimer == 0 && !entity.getData('tmf:dyn/upgrade_liquified'))) {
        manager.setData(entity, 'tmf:dyn/upgrade', null);
    }
    if (upgrade != 'fiskheroes:masonry_oven') {
        manager.setData(entity, 'tmf:dyn/pc_1', 0);
    }

    manager.incrementData(entity, "tmf:dyn/pt_3", 10, liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate" && flying && entity.isSprinting() && entity.getData('tmf:dyn/p_3'));
    if (!entity.isSprinting()) {
        manager.setData(entity, 'tmf:dyn/p_3', false);
    }
    manager.incrementData(entity, 'tmf:dyn/pc_3', 400, 200, entity.getData('tmf:dyn/p_3'), !entity.getData('tmf:dyn/p_3'))
    if (entity.getData('tmf:dyn/pc_3') == 1) {
        manager.setData(entity, 'tmf:dyn/p_3', false);
    }


    var flying = entity.getData("fiskheroes:flying");
    manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

    var item = entity.getHeldItem();
    flying &= !entity.as("PLAYER").isUsingItem();
    manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0 && entity.getData("fiskheroes:blade_timer") == 0);
    manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.25 && entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        entity.playSound("fiskheroes:suit.ironman.landing", 1, 1.15 - Math.random() * 0.3);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
    

    manager.incrementData(entity, 'fiskheroes:tentacle_extend_timer', 0, 5, false, flying || liquidTimer < 1 ? 1 : 0 )
}

function getAttributeProfile(entity) {
    var liquid = entity.getData('tmf:dyn/upgrade_liquified');
    var upgrade = entity.getData("tmf:dyn/upgrade");
    return (upgrade == "minecraft:piston" || (upgrade == null && liquid)) ? "UPGRADE_LIQUID" : (upgrade == "minecraft:noteblock" ? "UPGRADE_SPEAKER" : (upgrade == "fiskheroes:masonry_oven" ? "UPGRADE_GAS_CHAMBER" : (upgrade == "minecraft:anvil" ? "UPGRADE_ANVIL" : (upgrade == "fiskheroes:superhero_chestplate" ? "UPGRADE_MK50" : "UPGRADE"))));
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();
    var SL = nbt.getByte("upgrade");
    var liquid = entity.getData('tmf:dyn/upgrade_liquified');
    var P2 = entity.getData('tmf:dyn/p_2');
    var PC2 = entity.getData('tmf:dyn/pc_2');
    var gliding = entity.getData("fiskheroes:gliding");
    var flying = entity.getData("fiskheroes:flying");
    var upgrade = entity.getData("tmf:dyn/upgrade");
    var liquidTimer = entity.getData('tmf:dyn/upgrade_liquified_timer');


    if (modifier.id() == "upgrade_3") {
        return liquid == true && upgrade == null;
    }
    if (modifier.id() == "upgrade_4") {
        return liquid == false && upgrade == null;
    }
    if (modifier.id() == "upgrade_11") {
        return !liquid && SL >= 15;
    }
    if (modifier.id() == "upgrade_12") {
        return upgrade == "minecraft:piston";
    }
    if (modifier.id() == "upgrade_13") {
        return upgrade == "minecraft:noteblock";
    }
    if (modifier.id() == "upgrade_14") {
        return !entity.isSneaking() && upgrade == "minecraft:noteblock";
    }
    if (modifier.id() == "upgrade_15") {
        return upgrade == "minecraft:anvil";
    }
    if (modifier.id() == "upgrade_16") {
        return entity.isSneaking() && upgrade == "minecraft:noteblock";
    }
    if (modifier.id() == "upgrade_17") {
        return PC2 == 1 && upgrade == "fiskheroes:masonry_oven" && !entity.isSneaking();
    }
    if (modifier.id() == "upgrade_18") {
        return upgrade == "fiskheroes:masonry_oven" && !entity.isSneaking();
    }
    if (modifier.id() == "upgrade_19") {
        return PC2 != 1 && upgrade == "fiskheroes:masonry_oven" && !entity.isSneaking();
    }
    if (modifier.id() == "upgrade_20") {
        return upgrade == "fiskheroes:superhero_chestplate";
    }
    if (modifier.id() == "upgrade_21") {
        return entity.getData('tmf:dyn/pt_3') ==  0 && upgrade == "fiskheroes:superhero_chestplate";
    }
    if (modifier.id() == "upgrade_22") {
        return upgrade == "fiskheroes:superhero_chestplate" && entity.getData('fiskheroes:tentacle_extend_timer') == 0 && !flying;
    }
    if (modifier.id() == "upgrade_23") {
        return entity.getData('tmf:dyn/pt_3') !=  0;
    }
    if (modifier.id() == "upgrade_24") {
        return upgrade == "fiskheroes:superhero_chestplate" && entity.getData('fiskheroes:tentacle_extend_timer') == 0 && !flying;
    }

    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    var SL = nbt.getByte("upgrade");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var P1 = entity.getData('tmf:dyn/p_1');
    var liquid = entity.getData('tmf:dyn/upgrade_liquified');
    var liquidTimer = entity.getData('tmf:dyn/upgrade_liquified_timer');
    var gliding = entity.getData("fiskheroes:gliding");
    var upgrade = entity.getData("tmf:dyn/upgrade");
    var isHolding = entity.getHeldItem().name();
    var flying = entity.getData("fiskheroes:flying");

    if (keyBind == "0CHARGED_BEAM_UPGRADE_1") {
        return liquidTimer != 0 && (upgrade == "fiskheroes:masonry_oven" && (PC1 == 1 || P1));
    }
    if (keyBind == "0CHARGED_BEAM_UPGRADE_2") {
        return liquidTimer != 0 && upgrade == "minecraft:piston";
    }
    if (keyBind == "0HEAT_VISION_UPGRADE_1") {
        return liquidTimer != 0 && upgrade == "minecraft:noteblock";
    }

    if (keyBind == "CHARGED_BEAM") {
        return (liquidTimer == 0 && upgrade == null  && SL == 60) || (liquidTimer != 0 && (upgrade == "minecraft:piston"  || (upgrade == "fiskheroes:masonry_oven" && (PC1 == 1 || P1))));
    }
    if (keyBind == "HEAT_VISION") {
        return (liquidTimer != 0 && (upgrade == "minecraft:noteblock" || (upgrade == "fiskheroes:masonry_oven" && (PC1 != 1 && !P1))));
    }
    if (keyBind == "UPGRADE_LIQUID") {
        return !gliding && upgrade == null;
    }
    if (keyBind == "TENTACLES") {
        return  !flying && entity.isSneaking() && liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate";
    }
    if (keyBind == "TENTACLE_JAB") {
        return !flying && entity.getData('fiskheroes:tentacle_extend_timer') != 0 && !entity.isSneaking() && liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate";
    }
    if (keyBind == "AIM") {
        return  !flying && !entity.isSneaking() && liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate";
    }
    if (keyBind == "SHIELD") {
        return !flying && entity.getData('fiskheroes:tentacle_extend_timer') == 0 && liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate";
    }
    if (keyBind == "func_UPGRADE") {
        return !gliding && ((liquidTimer == 0 && upgrade == null) && (entity.getHeldItem().nbt().getString("HeroType") == "fiskheroes:iron_man_mk50" && isHolding == "fiskheroes:superhero_chestplate" && SL == 60) ||  (isHolding == "minecraft:noteblock" && SL == 60) || isHolding == "minecraft:piston" || (isHolding == "minecraft:anvil" && SL >= 15) || (isHolding == "fiskheroes:masonry_oven" && SL == 60)) || (liquidTimer != 0 && upgrade != null);
    }
    if (keyBind == "func_UPGRADE_FLIGHT_BOOST") {
        return entity.getData('fiskheroes:flight_boost_timer') != 0 && liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate";
    }

    return false;
}

function upgradeKey(player, manager) {
    var upgrade = player.getData("tmf:dyn/upgrade");

    player.playSound("tmf:upgrade.transform", 1, 0.9 + 0.2 * Math.random());

    if (upgrade == null) {
        manager.setData(player, "tmf:dyn/upgrade", player.getHeldItem().name());
        manager.setData(player, 'tmf:dyn/upgrade_liquified', true);
    }
    if (upgrade != null) {
        manager.setData(player, 'tmf:dyn/upgrade_liquified', false);
    }

    return true;
}

function upgradeFlightBoostKey(player, manager) {
    var timer = player.getData("tmf:dyn/p_3");
    player.playSound("tmf:upgrade.transform", 1, 0.9 + 0.2 * Math.random());
    manager.setData(player, 'tmf:dyn/p_3', !timer);

    return true;
}

function getTierOverride(entity) {
    var liquidTimer = entity.getData('tmf:dyn/upgrade_liquified_timer');
    var upgrade = entity.getData("tmf:dyn/upgrade");
    return liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate" ? 8 : 6;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function canAim(entity) {
    var upgrade = entity.getData("tmf:dyn/upgrade");
    var liquidTimer = entity.getData('tmf:dyn/upgrade_liquified_timer');
    return (entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying") && entity.getData('fiskheroes:tentacle_extend_timer') == 0 && !entity.isSneaking() && liquidTimer != 0 && upgrade == "fiskheroes:superhero_chestplate");
}