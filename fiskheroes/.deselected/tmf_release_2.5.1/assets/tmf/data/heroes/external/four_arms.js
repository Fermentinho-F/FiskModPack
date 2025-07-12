function init(hero) {
    hero.addKeyBind("CHARGED_BEAM3", "Thunder-Clap", 1);
    hero.addKeyBind("HEAT_VISION_FOURARMS_1", "Spinjitzu", 1); 
    
    hero.addKeyBind("CHARGED_BEAM", "key.mantaRays", 1);
    hero.addKeyBind("HEAT_VISION", "Aim", 1); 
    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 2);
    hero.addKeyBindFunc("func_FOURARMS_LEAP", fourarmsLeapKey, "Leap", 3);

    hero.addAttributeProfile("FOUR_ARMS", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("SPRINT_SPEED", 0.55, 1);
        profile.addAttribute("KNOCKBACK", 1, 0);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("MAX_HEALTH", -3, 0);
    });
    hero.addAttributeProfile("FOUR_ARMS_SHOOTING", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -10.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("SPRINT_SPEED", 0.55, 1);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("MAX_HEALTH", -3, 0);
    });
    hero.addAttributeProfile("FOUR_ARMS_SHOOTING_SPIN", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -10.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("BASE_SPEED", -10.25, 1);
        profile.addAttribute("MAX_HEALTH", -3, 0);
    });

    hero.addDamageProfile("FOURARMS_SLAM", {
        "types": {
            "BLUNT": 0.7,
            "EXPLOSION": 0.8
        },
        "properties": {
            "HIT_COOLDOWN": 20
          }
    });
}

function getAttributeProfile(entity) {
    return entity.getData('fiskheroes:heat_vision') ? "FOUR_ARMS_SHOOTING_SPIN" : (entity.getData('fiskheroes:beam_charging') ? "FOUR_ARMS_SHOOTING" : "FOUR_ARMS");
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }

    var nbt = entity.getWornChestplate().nbt();    
    var SL = nbt.getByte("four_arms");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var PT1 = entity.getData('tmf:dyn/pt_1');
    var PC2 = entity.getData('tmf:dyn/pc_2');
    var PT3 = entity.getData('tmf:dyn/pt_3');
    var PC3 = entity.getData('tmf:dyn/pc_3');
    var punchTimer = entity.getPunchTimerInterpolated();
    var noBeam = !entity.getData('fiskheroes:beam_charging') && !entity.getData('fiskheroes:heat_vision');
    
    //Random arm is picked
    if (PackLoader.getSide() == "SERVER") {
        var outcomes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        var randomOutcome = outcomes[Math.floor(Math.random() * outcomes.length)];

        if (PC1 == 0 && ((PT1 == 0 && PC2 == 0 && PT3 == 0 && PC3 == 0)) && punchTimer != 0 && punchTimer <= 0.2) {
            manager.setDataWithNotify(entity, 'tmf:dyn/pc_1', randomOutcome);
        }
    }
    if (PT1 == 1) {
        manager.setInterpolatedData(entity, 'tmf:dyn/pt_1', 0);  
    }
    if (PC2 == 1) {
        manager.setInterpolatedData(entity, 'tmf:dyn/pc_2', 0); 
    }
    if (PT3 == 1) {
        manager.setInterpolatedData(entity, 'tmf:dyn/pt_3', 0); 
    }
    if (PC3 == 1) {
        manager.setInterpolatedData(entity, 'tmf:dyn/pc_3', 0); 
    }

    manager.incrementData(entity, "tmf:dyn/pt_1", 8, entity.getData('tmf:dyn/pt_1') > 0 || (noBeam && (PC1 == 1 || PC1 == 5 || PC1 == 7 || PC1 == 9)));
    manager.incrementData(entity, "tmf:dyn/pc_2", 8, entity.getData('tmf:dyn/pc_2') > 0 || (noBeam && (PC1 == 2 || PC1 == 5 || PC1 == 8 || PC1 == 9)));
    manager.incrementData(entity, "tmf:dyn/pt_3", 8, entity.getData('tmf:dyn/pt_3') > 0 || (noBeam && (PC1 == 3 || PC1 == 6 || PC1 == 8 || PC1 == 9)));
    manager.incrementData(entity, "tmf:dyn/pc_3", 8, entity.getData('tmf:dyn/pc_3') > 0 || (noBeam && (PC1 == 4 || PC1 == 6 || PC1 == 7 || PC1 == 9)));

    if (PC1 != 0) {
        manager.setData(entity, 'tmf:dyn/pc_1', 0); 
    }


    manager.incrementData(entity, "tmf:dyn/pc_5", 40, entity.hasPotionEffect(18) ? 1 : 0);


    var angle = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle >= 315 || angle <= 45) && entity.world().blockAt(entity.pos().add(0, 0.5, 0.5)).isSolid());
    var moveLook_Z1 = ((angle >= 135 && angle <= 180) && entity.world().blockAt(entity.pos().add(0, 0.5, -0.5)).isSolid());
    var moveLook_Z2 = ((angle > 180 && angle <= 225) && entity.world().blockAt(entity.pos().add(0, 0.5, -0.5)).isSolid());
    var moveLookX = ((angle > 45 && angle < 135) && entity.world().blockAt(entity.pos().add(0.5, 0.5, 0)).isSolid());
    var moveLook_X = ((angle > 225 && angle < 315) && entity.world().blockAt(entity.pos().add(-0.5, 0.5, 0)).isSolid());
    var PC6 = entity.getData("tmf:dyn/pc_6");

    if ((moveLookZ || moveLook_Z1 || moveLook_Z2 || moveLookX || moveLook_X) && !entity.isOnGround()) {
        manager.setData(entity, "tmf:dyn/pc_6", moveLookZ ? 0 : (moveLook_Z1 ? (PC6 == 180 ? 180 : -180) : (moveLook_Z2 ? (PC6 == -180 ? -180 : 180) : (moveLookX ? -90 : 90))));
        manager.setData(entity, 'fiskheroes:flying', true);
    }

    var amount = Math.abs(entity.motionY());
    manager.setData(entity, "tmf:dyn/pc_7", entity.getData("tmf:dyn/pc_7") + amount);

    if (entity.getData("tmf:dyn/p_4") && entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "tmf:dyn/p_4", false);
    }

    superheroLanding(entity, manager, hero)
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("four_arms");
    var angle = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle >= 315 || angle <= 45) && entity.world().blockAt(entity.pos().add(0, 0.5, 0.5)).isSolid());
    var moveLook_Z = ((angle >= 135 && angle <= 225) && entity.world().blockAt(entity.pos().add(0, 0.5, -0.5)).isSolid());
    var moveLookX = ((angle > 45 && angle < 135) && entity.world().blockAt(entity.pos().add(0.5, 0.5, 0)).isSolid());
    var moveLook_X = ((angle > 225 && angle < 315) && entity.world().blockAt(entity.pos().add(-0.5, 0.5, 0)).isSolid());

    if (modifier.id() == "four_arms_0") {
        return  entity.rotPitch() < 0 && entity.rotPitch() >= -25;
    }
    if (modifier.id() == "four_arms_1") {
        return  entity.rotPitch() < -25 && entity.rotPitch() >= -50;
    }
    if (modifier.id() == "four_arms_2") {
        return  entity.rotPitch() < -50 && entity.rotPitch() >= -75;
    }
    if (modifier.id() == "four_arms_3") {
        return  entity.rotPitch() < -75;
    }

    if (modifier.id() == "four_arms_4") {
        return (moveLookZ || moveLook_Z || moveLookX || moveLook_X) && !entity.isOnGround() && !entity.getData("tmf:dyn/p_4");
    }

    if (modifier.id() == "four_arms_12") {
        return (moveLookZ || moveLook_Z || moveLookX || moveLook_X) && !entity.isOnGround() && entity.getData("tmf:dyn/p_4") && (entity.rotPitch() < -50 || entity.rotPitch() > 50);
    }
    if (modifier.id() == "four_arms_15") {
        return (moveLookZ || moveLook_Z || moveLookX || moveLook_X) && !entity.isOnGround() && entity.getData("tmf:dyn/p_4") && (entity.rotPitch() >= -50 && entity.rotPitch() <= 50);
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("four_arms");
    var punchTimer = entity.getPunchTimer();
    var isSneaking = entity.isSneaking();

    if (keyBind == "CHARGED_BEAM3") {
        return SL >= 15 && !isSneaking && !entity.getData("fiskheroes:flying");
    }
    if (keyBind == "HEAT_VISION_FOURARMS_1") {
        return SL == 60 && isSneaking;
    }

    if (keyBind == "CHARGED_BEAM") {
        return SL >= 15 && !isSneaking && !entity.getData("fiskheroes:flying");
    }
    if (keyBind == "HEAT_VISION") {
        return SL == 60 && isSneaking;
    }
    if (keyBind == "GROUND_SMASH") {
        return !entity.getData('fiskheroes:heat_vision') && entity.getData('fiskheroes:beam_charge') == 0;
    }

    if (keyBind == "func_FOURARMS_LEAP") {
        return entity.getData('fiskheroes:flying');
    }
    return false;
}

function getDefaultScale(entity) {
    return 1 + 0.54*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 8;
}

function superheroLanding(entity, manager, hero) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    var superLanding = entity.getData("fiskheroes:dyn/superhero_landing_timer");

    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < (entity.isSneaking() ? - 1.0 : -1.5) && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        entity.playSound("minecraft:random.explode", 1, 1.15 - Math.random() * 0.3);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 8, 10, t > 0);

    if (superLanding == 1) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 6);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "FOURARMS_SLAM", "%2$s got smashed", 8.0, entity);
            }
        }
    }
}

function fourarmsLeapKey(player, manager) {
    manager.setData(player, 'tmf:dyn/p_4', true);
    manager.setData(player, 'fiskheroes:flying', true);
    manager.setData(player, 'fiskheroes:flight_boost_timer', 1);
    player.playSound("minecraft:random.explode", 0.8, 1.15 - Math.random() * 0.3);
    return true;
}