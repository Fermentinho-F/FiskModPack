function init(hero) {

    hero.addAttributeProfile("STINKARMS", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
        profile.addAttribute("WEAPON_DAMAGE", -4.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.7, 1);
        profile.addAttribute("SPRINT_SPEED", 0.3, 1);
        profile.addAttribute("KNOCKBACK", 0.5, 0);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }

    var nbt = entity.getWornChestplate().nbt();
    var PT1 = entity.getInterpolatedData('tmf:dyn/pt_1');
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var PT2 = entity.getInterpolatedData('tmf:dyn/pt_2');
    var PC2 = entity.getInterpolatedData('tmf:dyn/pc_2');
    var PT3 = entity.getInterpolatedData('tmf:dyn/pt_3');
    var PC3 = entity.getInterpolatedData('tmf:dyn/pc_3');
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

    var PC_4 = entity.getData('tmf:dyn/pc_4');

    if (entity.isInWater()) {
        manager.setData(entity, 'tmf:dyn/pc_4', 400);
    }

    manager.incrementData(entity, "tmf:dyn/pc_4", 400, entity.isInWater());

    if (isBlockInRange(entity, manager, "minecraft:lava", 2) && PT1 != 0) {
        manager.setData(entity, 'tmf:dyn/pc_4', PC_4 - 0.05);
    }

    if (PC_4 < 0) {
        manager.setData(entity, 'tmf:dyn/pc_4', 0);
    }

    manager.incrementData(entity, "tmf:dyn/pt_4", 12, entity.getData('fiskheroes:flying'));
}

function getAttributeProfile(entity) {
        return "STINKARMS";
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var PC4 = entity.getInterpolatedData('tmf:dyn/pc_4');
    if (modifier.id() == "stinkarms_11") {
        return PC4 == 0 && entity.getInterpolatedData('tmf:dyn/pt_4') != 1;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    if (keyBind == "GROUND_SMASH") {
        return true;
    }
    return false;
}

function getDefaultScale(entity) {
    return 1 + 0.3*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 7;
}

function isBlockInRange(entity, manager, block, range) {
    for (var x = -1; Math.abs(x) <= range; x < 0 ? x=-x : x=-x-1) {
        for (var y = -1; Math.abs(y) <= range; y < 0 ? y=-y : y=-y-1) {
            for (var z = -1; Math.abs(z) <= range; z < 0 ? z=-z : z=-z-1) {
                if (entity.world().getBlock(entity.pos().add(x, y, z)) == block) {
                    manager.setData(entity, 'tmf:dyn/cX', Math.ceil(entity.posX() + x));
                    manager.setData(entity, 'tmf:dyn/cY', Math.ceil(entity.posY() + y));
                    manager.setData(entity, 'tmf:dyn/cZ', Math.ceil(entity.posZ() + z));
                    return true;
                }
            }
        }
    }
    return false;
}
