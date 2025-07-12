function init(hero) {
    hero.addKeyBindFunc("func_LOCATE", locateKey, "Locate", 1);

    hero.addAttributeProfile("WILDMUTT", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.65, 1);
        profile.addAttribute("BASE_SPEED", -0.15, 1);
        profile.addAttribute("SPRINT_SPEED", 0.55, 1);
        profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
    });

    hero.addAttributeProfile("WILDMUTT_LOCATING", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 0.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.65, 1);
        profile.addAttribute("BASE_SPEED", -10.15, 1);
        profile.addAttribute("SPRINT_SPEED", -10.5, 1);
        profile.addAttribute("JUMP_HEIGHT", -20.0, 0);
    });

    hero.addDamageProfile("WILDMUTT", {
        "types": {
            "BLUNT": 1.0,
            "SHARP": 0.6
        },
        "properties": {
        }
    });
}

function getAttributeProfile(entity) {
    return entity.getData('tmf:dyn/p_1') && entity.getData('tmf:dyn/pc_1') > 0 && entity.getData('tmf:dyn/pc_1') < 0.3 ? "WILDMUTT_LOCATING" : "WILDMUTT";
}

function getDamageProfile(entity) {
    return "WILDMUTT";
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    var SL = nbt.getByte("wildmutt");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var P2 = entity.getData('tmf:dyn/p_2');
    var flight = entity.getData("fiskheroes:flying");

    if (keyBind == "func_LOCATE") {
        return SL >= 15 && PC1 == 0 && entity.getHeldItem().name().endsWith("_ore") && entity.getData('tmf:dyn/pc_5') == 0;
    }

    return false;
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var angle = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle >= 315 || angle <= 45) && entity.world().blockAt(entity.pos().add(0, 0.5, 0.5)).isSolid());
    var moveLook_Z = ((angle >= 135 && angle <= 225) && entity.world().blockAt(entity.pos().add(0, 0.5, -0.5)).isSolid());
    var moveLookX = ((angle > 45 && angle < 135) && entity.world().blockAt(entity.pos().add(0.5, 0.5, 0)).isSolid());
    var moveLook_X = ((angle > 225 && angle < 315) && entity.world().blockAt(entity.pos().add(-0.5, 0.5, 0)).isSolid());

    if (modifier.id() == "wildmutt_4") {
        return (moveLookZ || moveLook_Z || moveLookX || moveLook_X) && !entity.isOnGround();
    }

    return true;
}


function locateKey(player, manager) {
    var timer = player.getData("tmf:dyn/p_3");
    var block = player.getHeldItem().name();
    var nbt = player.getWornChestplate().nbt();
    var SL = nbt.getByte("wildmutt");

    if (isBlockInRange(player, manager, block, SL == 60 ? 16 : 8)) {
        manager.setData(player, 'tmf:dyn/p_1', true);
        player.playSound("tmf:wildmutt.echo", 2, 0.9 + 0.2 * Math.random());
    }
    if (!isBlockInRange(player, manager, block, SL == 60 ? 16 : 8)) {
        manager.setData(player, 'tmf:dyn/p_1', false);
    }

    return true;
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }
    var nbt = entity.getWornChestplate().nbt();
    var SL = nbt.getByte("wildmutt");
    var distanceToBlock = entity.pos().distanceTo(entity.getData('tmf:dyn/cX'), entity.getData('tmf:dyn/cY'), entity.getData('tmf:dyn/cZ'));

    manager.incrementData(entity, "tmf:dyn/pt_1", 10, entity.isSprinting() ? 1 : 0 );

    if (entity.getData('tmf:dyn/pc_1') == 1) {
        manager.setData(entity, 'tmf:dyn/p_1', false);
    }

    manager.incrementData(entity, "tmf:dyn/pc_1", 300, entity.getData('tmf:dyn/p_1') ? 1 : 0 );
    manager.setData(entity, "tmf:dyn/pt_3", entity.getData('tmf:dyn/p_1') ? distanceToBlock/16 : 0 );
    manager.incrementData(entity, "tmf:dyn/pc_5", 40, entity.hasPotionEffect(18) ? 1 : 0);

    var angle = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle >= 315 || angle <= 45) && entity.world().blockAt(entity.pos().add(0, 0.5, 0.5)).isSolid());
    var moveLook_Z1 = ((angle >= 135 && angle <= 180) && entity.world().blockAt(entity.pos().add(0, 0.5, -0.5)).isSolid());
    var moveLook_Z2 = ((angle > 180 && angle <= 225) && entity.world().blockAt(entity.pos().add(0, 0.5, -0.5)).isSolid());
    var moveLookX = ((angle > 45 && angle < 135) && entity.world().blockAt(entity.pos().add(0.5, 0.5, 0)).isSolid());
    var moveLook_X = ((angle > 225 && angle < 315) && entity.world().blockAt(entity.pos().add(-0.5, 0.5, 0)).isSolid());
    var PC3 = entity.getData("tmf:dyn/pc_3");

    if ((moveLookZ || moveLook_Z1 || moveLook_Z2 || moveLookX || moveLook_X) && !entity.isOnGround()) {
        manager.setData(entity, "tmf:dyn/pc_3", moveLookZ ? 0 : (moveLook_Z1 ? (PC3 == 180 ? 180 : -180) : (moveLook_Z2 ? (PC3 == -180 ? -180 : 180) : (moveLookX ? -90 : 90))));
        manager.setData(entity, 'fiskheroes:flying', true);
    }

    var amount = Math.abs(entity.motionY());
    manager.setData(entity, "tmf:dyn/pc_4", entity.getData("tmf:dyn/pc_4") + amount);
}

function isBlockInRange(player, manager, block, range) {
    for (var x = -1; Math.abs(x) <= range; x < 0 ? x=-x : x=-x-1) {
        for (var y = -1; Math.abs(y) <= range; y < 0 ? y=-y : y=-y-1) {
            for (var z = -1; Math.abs(z) <= range; z < 0 ? z=-z : z=-z-1) {
                if (player.world().getBlock(player.pos().add(x, y, z)) == block) {
                    manager.setData(player, 'tmf:dyn/cX', Math.ceil(player.posX() + x));
                    manager.setData(player, 'tmf:dyn/cY', Math.ceil(player.posY() + y));
                    manager.setData(player, 'tmf:dyn/cZ', Math.ceil(player.posZ() + z));
                    return true;
                }
            }
        }
    }
    return false;
}
function getTierOverride(entity) {
    return 6;
}
