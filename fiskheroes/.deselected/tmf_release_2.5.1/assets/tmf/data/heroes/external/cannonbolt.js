function init(hero) {
    hero.addKeyBind("0ACHARGE_CB", "Speed Charge", 1);
    hero.addKeyBind("0CB_TORNADO", "Tornado Spin", 1);
    hero.addKeyBind("BLOCK_CB", "Hand Block", 2);

    hero.addKeyBind("CHARGE_ICE", "Charge Shards", 1);
    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("SHIELD", "key.forcefield", 2);
    hero.addKeyBindFunc("func_CANNONBOLT", cannonboltKey, "Shell Transformation", 4);

    hero.addAttributeProfile("CANNONBOLT", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", -0.44, 1);
        profile.addAttribute("FALL_RESISTANCE", 0.35, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("CANNONBOLT_TORNADO", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", -10.0, 1);
        profile.addAttribute("FALL_RESISTANCE", 0.35, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("CANNONBOLT_S1", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 0.0, 1);
        profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.65, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("CANNONBOLT_S2", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 0.5, 1);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 0.75, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.85, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("CANNONBOLT_S3", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 1.0, 1);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("STEP_HEIGHT", 1.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.85, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });
    hero.addAttributeProfile("CANNONBOLT_S4", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 1.5, 1);
        profile.addAttribute("SPRINT_SPEED", 0.4, 1);
        profile.addAttribute("STEP_HEIGHT", 1.25, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.85, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });
    hero.addAttributeProfile("CANNONBOLT_S5", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 2.0, 1);
        profile.addAttribute("SPRINT_SPEED", 0.6, 1);
        profile.addAttribute("STEP_HEIGHT", 1.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.85, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });
    hero.addAttributeProfile("CANNONBOLT_S6", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 2.5, 1);
        profile.addAttribute("SPRINT_SPEED", 0.8, 1);
        profile.addAttribute("STEP_HEIGHT", 1.75, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.25, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.85, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });
    hero.addAttributeProfile("CANNONBOLT_S7", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("BASE_SPEED", 3.0, 1);
        profile.addAttribute("SPRINT_SPEED", 1.0, 1);
        profile.addAttribute("STEP_HEIGHT", 2.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addDamageProfile("CANNONBOLT_RAM", {
        "types": {
            "BLUNT": 0.7,
            "EXPLOSION": 0.8
        },
        "properties": {
            "ADD_KNOCKBACK": 1.0,
                "EFFECTS": [
                  {
                    "id": "minecraft:nausea",
                    "duration": 20,
                    "amplifier": 2,
                    "chance": 0.4
                  },
                  {
                    "id": "minecraft:slowness",
                    "duration": 20,
                    "amplifier": 1,
                    "chance": 0.3
                  }
                ]
          }
    });
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }

    var PT1 = entity.getData("tmf:dyn/pt_1");
    var PC1 = entity.getInterpolatedData("tmf:dyn/pc_1");
    var PT3 = entity.getInterpolatedData("tmf:dyn/pt_3");
    var angle = entity.rotYaw() * Math.PI / 180;
    var cryoCharge = entity.getData("fiskheroes:cryo_charge");
    var cryoCharging = entity.getData("fiskheroes:cryo_charging");
    var offset = entity.motionZ() * Math.cos(angle) - entity.motionX() * Math.sin(angle) + (entity.motionY() > 0 ? 0.3*entity.motionY() : 0);
    var mot = Math.sqrt(Math.pow(entity.motionInterpolated().x(),2) + Math.pow(entity.motionInterpolated().z(), 2));
    var angle2 = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle2 >= 315 || angle2 <= 45) && entity.world().blockAt(entity.pos().add(0, 0, 1)).isSolid());
    var moveLook_Z = ((angle2 >= 135 && angle2 <= 225) && entity.world().blockAt(entity.pos().add(0, 0, -1)).isSolid());
    var moveLookX = ((angle2 > 45 && angle2 < 135) && entity.world().blockAt(entity.pos().add(1, 0, 0)).isSolid());
    var moveLook_X = ((angle2 > 225 && angle2 < 315) && entity.world().blockAt(entity.pos().add(-1, 0, 0)).isSolid());

    manager.setData(entity, "tmf:dyn/pc_1", PT1 == 0 ? 0 : (PC1 + offset + (cryoCharging ? PT3 : 0) + (entity.getData("tmf:dyn/pt_3") >= 0.84 && entity.motionY() > -1 && (moveLookZ || moveLook_Z || moveLookX || moveLook_X))));

    manager.incrementData(entity, "tmf:dyn/pt_1", 6, entity.getData('tmf:dyn/p_1'));


    // cryo charge when held adds 0.05 each tick

    if (cryoCharging) {
        manager.setData(entity, 'fiskheroes:cryo_charge', 0);
    }

    if (entity.getData("tmf:dyn/pt_3") >= 0.14 && mot > 0.2 && !entity.isSneaking()) {

    }

    manager.incrementData(entity, "tmf:dyn/pt_3", 120, 60,cryoCharging ,entity.isSneaking());

    manager.incrementData(entity, "tmf:dyn/pt_3", 0, 10, false , PT1 != 1);


    if (entity.getData('tmf:dyn/pt_3') != 0) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 3);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other)) {
                other.hurtByAttacker(hero, "CANNONBOLT_RAM", "%2$s got pancaked", Math.ceil(20*(3*Math.abs(entity.motionX()) + Math.abs(entity.motionY()) + 3*Math.abs(entity.motionZ()))), entity);
            }
        }
    }
    superheroLanding(entity, manager, hero)
}

function getAttributeProfile(entity) {
    var PT1 = entity.getData("tmf:dyn/pt_1");
    var cryoCharge = entity.getData("tmf:dyn/pt_3");
    if (PT1 == 0) {
        return "CANNONBOLT";
    }
    else if (PT1 != 0) {
        if (entity.getData('fiskheroes:beam_charge') == 0) {
            if (cryoCharge >= 0 && cryoCharge < 0.14) {
                return "CANNONBOLT_S1";
            }
            if (cryoCharge >= 0.14 && cryoCharge < 0.28) {
                return "CANNONBOLT_S2";
            }
            if (cryoCharge >= 0.28 && cryoCharge < 0.42) {
                return "CANNONBOLT_S3";
            }
            if (cryoCharge >= 0.42 && cryoCharge < 0.56) {
                return "CANNONBOLT_S4";
            }
            if (cryoCharge >= 0.56 && cryoCharge < 0.70) {
                return "CANNONBOLT_S5";
            }
            if (cryoCharge >= 0.70 && cryoCharge < 0.84) {
                return "CANNONBOLT_S6";
            }
            if (cryoCharge >= 0.84 && cryoCharge <= 1.0) {
                return "CANNONBOLT_S7";
            }
        }
        if (entity.getData('fiskheroes:beam_charge') != 0) {
            return "CANNONBOLT_TORNADO";
        }
    
    }
    return null;
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var cryoCharge = entity.getData("tmf:dyn/pt_3");
    var angle = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle >= 315 || angle <= 45) && entity.world().blockAt(entity.pos().add(0, 0, 1)).isSolid());
    var moveLook_Z = ((angle >= 135 && angle <= 225) && entity.world().blockAt(entity.pos().add(0, 0, -1)).isSolid());
    var moveLookX = ((angle > 45 && angle < 135) && entity.world().blockAt(entity.pos().add(1, 0, 0)).isSolid());
    var moveLook_X = ((angle > 225 && angle < 315) && entity.world().blockAt(entity.pos().add(-1, 0, 0)).isSolid());
    var PT1 = entity.getData("tmf:dyn/pt_1");

    if (modifier.id() == "cannonbolt_2") {
        return  (PT1 == 1);
    }
    if (modifier.id() == "cannonbolt_5") {
        return  (PT1 != 1);
    }
    if (modifier.id() == "cannonbolt_6") {
        return  (PT1 == 1);
    }
    if (modifier.id() == "cannonbolt_7") {
        return  (PT1 == 1);
    }

    if (modifier.id() == "cannonbolt_8") {
        return  (cryoCharge >= 0.14 && cryoCharge < 0.42);
    }
    if (modifier.id() == "cannonbolt_9") {
        return  (cryoCharge >= 0.42 && cryoCharge < 0.70);
    }
    if (modifier.id() == "cannonbolt_10") {
        return  (cryoCharge >= 0.70);
    }

    if (modifier.id() == "cannonbolt_16") {
        return true;
    }

    if (modifier.id() == "cannonbolt_14") {
        return entity.getData("tmf:dyn/pt_3") >= 0.84 && entity.motionY() > -1 && (moveLookZ || moveLook_Z || moveLookX || moveLook_X);
    }
    if (modifier.id() == "cannonbolt_15") {
        return  (PT1 == 0);
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("cannonbolt");

    if (keyBind == "0ACHARGE_CB") {
        return !entity.isSneaking() && entity.getData('tmf:dyn/pt_1') == 1 && SL >= 15;
    }
    if (keyBind == "0CB_TORNADO") {
        return entity.isSneaking() && entity.getData('tmf:dyn/pt_1') == 1 && SL >= 60;
    }
    if (keyBind == "BLOCK_CB") {
        return entity.getData('tmf:dyn/pt_1') == 0;
    }

    if (keyBind == "CHARGE_ICE") {
        return !entity.isSneaking() && entity.getData('tmf:dyn/pt_1') == 1 && SL >= 15;
    }
    if (keyBind == "CHARGED_BEAM") {
        return entity.isSneaking() && entity.getData('tmf:dyn/pt_1') == 1 && SL >= 60;
    }
    if (keyBind == "SHIELD") {
        return entity.getData('tmf:dyn/pt_1') == 0;
    }
    if (keyBind == "func_CANNONBOLT") {
        return true;
    }
    return false;
}

function hasProperty(entity, property) {
    return false;
}

function getDefaultScale(entity) {
    return 1 + 0.2*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return entity.getData("tmf:dyn/pt_1") == 1 ? 8 : 6;
}

function cannonboltKey(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", !player.getData('tmf:dyn/p_1'));
    return true;
}

function superheroLanding(entity, manager, hero) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    var superLanding = entity.getData("fiskheroes:dyn/superhero_landing_timer");

    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < (entity.isSneaking() ? - 1.0 : -1.5) && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        entity.playSound("minecraft:random.explode", 1.5, 1.15 - Math.random() * 0.3);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 8, 18, t > 0);

    if (superLanding == 1) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 15);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "CANNONBOLT_RAM", "%2$s got pancaked", Math.ceil(20*(Math.abs(entity.motionX()) + Math.abs(entity.motionY()) + Math.abs(entity.motionZ()))), entity);
                }
        }
    }
}