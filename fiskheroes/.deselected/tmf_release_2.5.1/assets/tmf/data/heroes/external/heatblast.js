function init(hero) {
    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("HEAT_VISION", "Aim", 1); 
    hero.addKeyBind("HEATBLAST_TORNADO", "Toggle Tornado", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
    hero.addKeyBind("HEATBLAST_METEOR", "Charge Meteor", 3);
    hero.addKeyBindFunc("func_HEATBLAST_BLAST", heatblastBlast, "Heat Outburst", 4);

    hero.addKeyBind("HEAT_VISION_HEATBLAST1", "Heat Blast", 1);
    hero.addKeyBind("HEATBLAST_1", "Cold Blast", 1);

    hero.addDamageProfile("FLAME_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 0.6
        },
        "properties": {
            "HEAT_TRANSFER": 40,
            "IGNITE": 2
        }
    });

    hero.addDamageProfile("ICE_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "COLD": 0.6
        },
        "properties": {
            "EFFECTS": [
              {
                "id": "minecraft:slowness",
                "duration": 10,
                "amplifier": 1,
                "chance": 0.4
              },
              {
                "id": "minecraft:weakness",
                "duration": 40,
                "amplifier": 1,
                "chance": 0.6
              }
            ]
        }
    });

    hero.addAttributeProfile("HEATBLAST", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.65, 1);
    });

    hero.addAttributeProfile("HEATBLAST_STANDING", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3.5, 0);
        profile.addAttribute("BASE_SPEED", -2.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.65, 1);
    });
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }

    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("heatblast");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var flight = entity.getData("fiskheroes:flying");

    if (PC1 == 1) {
        manager.setData(entity, 'tmf:dyn/p_5', false);
        manager.setData(entity, 'fiskheroes:flying', false);
    }
    manager.incrementData(entity, "tmf:dyn/pc_1", 60, 200, entity.getData("tmf:dyn/p_5"));

    if (entity.getData("tmf:dyn/p_5")) {
        if (PC1 >= 0.7) {
            var list = entity.world().getEntitiesInRangeOf(entity.pos(), 10);
            for (var i = 0; i < list.size(); ++i) {
                var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
                    other.hurtByAttacker(hero, "FLAME_PUNCH", "%2$s was molten to death by %1$s", 7.5, entity);
                }
            }
            
            entity.playSound("minecraft:random.explode", entity.ticksExisted() % 14 == 0 ? 1 : 0, 1.15 - Math.random() * 0.3);
        }
        manager.setData(entity, 'fiskheroes:flying', true);
    }
    if (flight) {
        if (entity.getData("tmf:dyn/heatblast_meteor_timer") >= 0.6) {
            manager.setData(entity, 'tmf:dyn/p_2', true);
        }
        if (entity.getData('tmf:dyn/p_2')) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 7, Math.sqrt(Math.pow(entity.motionX(),2) + Math.pow(entity.motionZ(), 2)) > 0.35 ? 1 : 0 );
        }
    }
    if (!flight) {
        manager.setData(entity, 'tmf:dyn/p_2', false);
    }

    manager.incrementData(entity, "tmf:dyn/pt_3", 10, entity.isInWater() ? 1 : 0);

    manager.incrementData(entity, "tmf:dyn/pc_5", 40, entity.hasPotionEffect(18) ? 1 : 0);

    manager.incrementData(entity, "tmf:dyn/pc_4", 600, entity.getData("tmf:dyn/heatblast_tornado"));

    if (entity.getData("tmf:dyn/heatblast_tornado")) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 4);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
                other.hurtByAttacker(hero, "FLAME_PUNCH", "%2$s was burnt to a crisp by %1$s", 1.5, entity);
            }
        }
        entity.playSound("fiskheroes:suit.firestorm.flight.enable", entity.ticksExisted() % 60 == 0 ? 0.4 : 0, 1.15 - Math.random() * 0.3);

        entity.playSound("fiskheroes:suit.firestorm.boost.loop", entity.ticksExisted() % 20 == 0 ? 0.6 : 0, 1.15 - Math.random() * 0.3);
    }

    superheroLanding(entity, manager)
}

function getAttributeProfile(entity) {
    return (entity.getData('tmf:dyn/pc_1') != 0 && entity.getData("tmf:dyn/p_5")) || entity.getData("tmf:dyn/heatblast_meteor_timer") != 0 ? "HEATBLAST_STANDING" : "HEATBLAST";
}

function getDamageProfile(entity) {
    var SICK = entity.getData('tmf:dyn/pc_5');
    return entity.getHeldItem().isEmpty() ? (SICK == 0 ? "FLAME_PUNCH" : "ICE_PUNCH") : null;
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("heatblast");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var P2 = entity.getData('tmf:dyn/p_2');
    var HB_TORNADO = entity.getData('tmf:dyn/heatblast_tornado');
    var SICK = entity.getData('tmf:dyn/pc_5');

    if (modifier.id() == "heatblast_1") {
        return  !HB_TORNADO && SICK == 0 && (SL >= 0 && entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying"));
    }
    if (modifier.id() == "heatblast_2") {
        return  SICK == 0 && (SL >= 0 && PC1 == 0 && (entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying")) || (P2 == true && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:flying")));
    }

    if (modifier.id() == "heatblast_3") {
        return  !HB_TORNADO && SICK == 0 && SL >= 15 && P2 == true && !entity.getData("tmf:dyn/p_5");
    }

    if (modifier.id() == "heatblast_4") {
        return  !HB_TORNADO && SICK == 0 && (SL == 60 || entity.getData("tmf:dyn/heatblast_meteor_timer") >= 0.5) && P2 == false && !entity.getData("tmf:dyn/p_5");
    }

    if (modifier.id() == "heatblast_5") {
        return  entity.getData("tmf:dyn/p_5");
    }

    if (modifier.id() == "heatblast_11") {
        return SICK == 1;
    }
    if (modifier.id() == "heatblast_12") {
        return SICK == 1;
    }
    if (modifier.id() == "heatblast_13") {
        return SICK == 1;
    }

    if (modifier.id() == "heatblast_15") {
        return SICK == 0;
    }
    if (modifier.id() == "heatblast_16") {
        return SICK == 0;
    }

    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("heatblast");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var P2 = entity.getData('tmf:dyn/p_2');
    var flight = entity.getData("fiskheroes:flying");
    var SICK = entity.getData('tmf:dyn/pc_5');
    var HB_TORNADO = entity.getData('tmf:dyn/heatblast_tornado');
    var HB_METEOR = entity.getData('tmf:dyn/heatblast_meteor');
    
    if (keyBind == "CHARGED_BEAM") {
        return SICK == 1 && entity.getHeldItem().isEmpty();
    }
    if (keyBind == "AIM") {
        return !HB_METEOR && !HB_TORNADO && SL >= 0 && PC1 == 0 && !flight && (entity.getData('fiskheroes:beam_charge') == 0 || entity.getData('fiskheroes:beam_charging'));
    }
    if (keyBind == "HEAT_VISION") {
        return !HB_METEOR && !HB_TORNADO && SICK == 0 && SL >= 0 && PC1 == 0 && (!flight) || (P2 == true && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:flying"));
    }

    if (keyBind == "HEAT_VISION_HEATBLAST1") {
        return !HB_TORNADO && SICK == 0 && SL >= 0 && PC1 == 0 && !flight;
    }
    if (keyBind == "HEATBLAST_1") {
        return SICK == 1 && entity.getHeldItem().isEmpty();
    }

    if (keyBind == "HEATBLAST_METEOR") {
        return !HB_TORNADO && PC1 == 0 && SL >= 15 && SICK == 0 && !flight;
    }
    if (keyBind == "HEATBLAST_TORNADO") {
        return PC1 == 0 && SL >= 60 && SICK == 0 && !flight && (entity.getData("tmf:dyn/heatblast_meteor_timer") == 1 || HB_TORNADO);
    }
    if (keyBind == "TELEPORT") {
        return SICK == 0 && entity.getData("tmf:dyn/heatblast_tornado_timer") == 1 && !flight;
    }

    if (keyBind == "func_HEATBLAST_BLAST") {
        return !HB_TORNADO && PC1 == 0 && SL >= 60 && SICK == 0 && !flight;
    }

    return false;
}

function hasProperty(entity, property) {
    return false;
}

function canAim(entity) {
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var P2 = entity.getData('tmf:dyn/p_2');
    var HB_TORNADO = entity.getData('tmf:dyn/heatblast_tornado');
    return !entity.getData('tmf:dyn/heatblast_meteor') && !HB_TORNADO && ((entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying") && entity.getData('tmf:dyn/pc_1') == 0) || (P2 == true && entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:flying") && PC1 == 0));
}

function getDefaultScale(entity) {
    return 1 - 0.04*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 6;
}

function superheroLanding(entity, manager) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.25 && entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }
    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
}


function heatblastBlast(player, manager) {
    manager.setData(player, "tmf:dyn/p_5", true);
    player.playSound("minecraft:fire.fire", 1.5, 1.15 - Math.random() * 0.3);
    player.playSound("minecraft:liquid.lava", 1.5, 1.15 - Math.random() * 0.3);
    return true;
}
