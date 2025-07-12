function init(hero) {
    hero.addKeyBind("CHARGED_BEAM_WAYBIG", "Cosmic Ray", 1);

    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBindFunc("func_WAYBIG_STOMP", waybigStomp, "Stomp", 3);

    hero.addAttributeProfile("WAYBIG", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("WEAPON_DAMAGE", -5.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.5, 0);
        profile.addAttribute("KNOCKBACK", 1, 0);
        profile.addAttribute("STEP_HEIGHT", 5, 0);
        profile.addAttribute("MAX_HEALTH", -9, 0);
        profile.addAttribute("REACH_DISTANCE", 1.0, 0);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
    });
    hero.addAttributeProfile("WAYBIG_STANDING", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10000.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -10000, 0);
        profile.addAttribute("BASE_SPEED", -10000.0, 0);
        profile.addAttribute("MAX_HEALTH", -9, 0);
    });

    hero.addSoundEvent("PUNCH", "tmf:waybig_punch");
    hero.addSoundEvent("STEP", "tmf:waybig_walk");

    hero.addDamageProfile("WAYBIG_STOMP", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 20
          }
    });
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }
    var PT_1 = entity.getData("tmf:dyn/pt_1");

    manager.incrementData(entity, "tmf:dyn/pt_1", 60, 200, entity.getData("tmf:dyn/p_1"));
    manager.incrementData(entity, "tmf:dyn/pc_1", 40, PT_1 == 1);
    if (PT_1 == 1) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 10);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            for (var x = 0; x < 4; ++x) {
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "WAYBIG_STOMP", "%2$s got stepped on too hard", 6.5, entity);
                }
            }
        }
    }
    if (entity.getData("tmf:dyn/pc_1") == 1) {
        manager.setData(entity, "tmf:dyn/p_1", false);
    }

    superheroLanding(entity, manager, hero);

    manager.setData(entity, "fiskheroes:size_state", 1);

    manager.incrementData(entity, "tmf:dyn/pt_3", 10, entity.isSprinting());
}

function getAttributeProfile(entity) {
    var P_1 = entity.getData("tmf:dyn/p_1");
    return (P_1 || entity.getData("fiskheroes:heat_vision") || entity.getData("fiskheroes:beam_charging")) ? "WAYBIG_STANDING" : "WAYBIG";
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("waybig");
    var P_1 = entity.getData("tmf:dyn/p_1");
    var BWB = nbt.getBoolean("BigWayBig");


    if (modifier.id() == "waybig_2") {
        return BWB;
    }
    if (modifier.id() == "waybig_2_1") {
        return !BWB;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("waybig");

    if (keyBind == "CHARGED_BEAM_WAYBIG") {
        return SL >= 60;
    }

    if (keyBind == "CHARGED_BEAM") {
        return SL >= 60;
    }
    if (keyBind == "func_WAYBIG_STOMP") {
        return entity.getData("tmf:dyn/pt_1") == 0 && SL >= 15;
    }

    return false;
}

function waybigStomp(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", true);
    return true;
}

function superheroLanding(entity, manager, hero) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    var superLanding = entity.getData("fiskheroes:dyn/superhero_landing_timer");

    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.5 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        entity.playSound("fiskheroes:suit.antimonitor.land", 1, 1.15 - Math.random() * 0.3);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 8, 18, t > 0);

    if (superLanding == 1) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 60);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            for (var x = 0; x < 10; ++x) {
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "WAYBIG_STOMP", "%2$s got smashed", 10.0, entity);
                }
            }
        }
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function getDefaultScale(entity) {
    return 1.0;
}

function getTierOverride(entity) {
        return 9;
}
