function init(hero) {
    hero.addKeyBind("ECHO2x_SHOUT", "Super-Sonic Scream", 1); 
    hero.addKeyBind("ECHO2x_SCREAM", "Wall Of Sound", 1); 
    hero.addKeyBind("ECHO2X_BLOCK", "Sound Shield", 2);

    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("SHIELD", "key.forcefield", 2);
    hero.addKeyBindFunc("func_DUPLICATE_ECHO2X", duplicateEcho2xKey, "Dupe", 4);

    
    hero.addAttributeProfile("ECHO2x_SHOOT", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("BASE_SPEED", -0.6, 1);
        profile.addAttribute("SPRINT_SPEED", -0.2, 1);
        profile.addAttribute("JUMP_HEIGHT", -10.0, 0);
    });

    hero.addAttributeProfile("ECHO2x1", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    });

    hero.addAttributeProfile("ECHO2x2", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", 2, 0);
    });

    hero.addAttributeProfile("ECHO2x3", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", 4, 0);
    });
    hero.addAttributeProfile("ECHO2x4", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", 6, 0);
    });
    hero.addAttributeProfile("ECHO2x5", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", 8, 0);
    });
    hero.addAttributeProfile("ECHO2x6", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", 10, 0);
    });
    hero.addAttributeProfile("ECHO2x7", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", 12, 0);
    });
    hero.addAttributeProfile("ECHO2x8", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", +14, 0);
    });
    hero.addAttributeProfile("ECHO2x9", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.4, 1);
        profile.addAttribute("SPRINT_SPEED", 0.15, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", 16, 0);
    });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var nbt = entity.getWornChestplate().nbt();    
    var SL = nbt.getByte("echo_echo");

    if (SL < 60) {
        manager.setByte(nbt, "echo_echo", 60);
    }
    var clone1 = entity.getData('tmf:dyn/pc_5') >= 1;
    var clone2 = entity.getData('tmf:dyn/pc_5') >= 2;
    var clone3 = entity.getData('tmf:dyn/pc_5') >= 3;
    var clone4 = entity.getData('tmf:dyn/pc_5') >= 4;
    var clone5 = entity.getData('tmf:dyn/pc_5') >= 5;
    var clone6 = entity.getData('tmf:dyn/pc_5') >= 6;
    var clone7 = entity.getData('tmf:dyn/pc_5') >= 7;
    var clone8 = entity.getData('tmf:dyn/pc_5') >= 8;

    var clonesCompressed = (clone1 && duplicateFuse(entity, 1))+(clone2 && duplicateFuse(entity, -1))+(clone3 && duplicateFuse(entity, 2))+(clone4 && duplicateFuse(entity, -2))+(clone5 && duplicateFuse(entity, 1))+(clone6 && duplicateFuse(entity, -1) + (clone7 && duplicateFuse(entity, 2)) + (clone8 && duplicateFuse(entity, -2)));

    manager.incrementData(entity, "tmf:dyn/pt_1", 20, 20, clone1 && !duplicateFuse(entity, 1) );
    manager.incrementData(entity, "tmf:dyn/pc_1", 20, 20, clone2 && !duplicateFuse(entity, -1));
    manager.incrementData(entity, "tmf:dyn/pt_3", 20, 20, clone3 && !duplicateFuse(entity, 2) );
    manager.incrementData(entity, "tmf:dyn/pc_3", 20, 20, clone4 && !duplicateFuse(entity, -2));
    manager.incrementData(entity, "tmf:dyn/pt_4", 20, 20, clone5 && !duplicateFuse(entity, 1) );
    manager.incrementData(entity, "tmf:dyn/pc_4", 20, 20, clone6 && !duplicateFuse(entity, -1));
    manager.incrementData(entity, "tmf:dyn/pt_7", 20, 20, clone7 && !duplicateFuse(entity, 2) );
    manager.incrementData(entity, "tmf:dyn/pc_7", 20, 20, clone8 && !duplicateFuse(entity, -2));
    
    if (entity.getData("fiskheroes:shield") || entity.getData('tmf:dyn/timeout')) {
        manager.setInterpolatedData(entity, "tmf:dyn/pc_5", 0);
    }
    if (entity.getData("fiskheroes:flying")) {
        manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
    }
    manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);

    entity.playSound("fiskheroes:suit.ironman.nanotech.mk50.cannon.shoot", entity.getData("tmf:dyn/pc_6") != clonesCompressed ? 0.35 : 0, 2.2 + 0.4 * Math.random());
    manager.incrementData(entity, "tmf:dyn/pc_8", 2, entity.getData("tmf:dyn/pc_6") != clonesCompressed);
    manager.setData(entity, "tmf:dyn/pc_6", clonesCompressed);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield") || (entity.getData('fiskheroes:beam_charging') && entity.getData("fiskheroes:beam_charge") != 0) ? "ECHO2x_SHOOT" : "ECHO2x"+(1+entity.getData('tmf:dyn/pc_5') - entity.getData('tmf:dyn/pc_6'));
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("echo_echo");
    var cloneCount = entity.getData('tmf:dyn/pc_5') - entity.getData('tmf:dyn/pc_6');

    if (modifier.id() == "echo_echo_0") {
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
    }

    if (modifier.id() == "echo_echo_scream_0") {
        return cloneCount == 0;
    }
    if (modifier.id() == "echo_echo_scream_1") {
        return cloneCount == 1;
    }
    if (modifier.id() == "echo_echo_scream_2") {
        return cloneCount == 2;
    }
    if (modifier.id() == "echo_echo_scream_3") {
        return cloneCount == 3;
    }
    if (modifier.id() == "echo_echo_scream_4") {
        return cloneCount == 4;
    }
    if (modifier.id() == "echo_echo_scream_5") {
        return cloneCount == 5;
    }
    if (modifier.id() == "echo_echo_scream_6") {
        return cloneCount == 6;
    }
    if (modifier.id() == "echo_echo_scream_7") {
        return cloneCount == 7;
    }
    if (modifier.id() == "echo_echo_scream_8") {
        return cloneCount == 8;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("echo_echo");
    var cloneCount = entity.getData('tmf:dyn/pc_5') - entity.getData('tmf:dyn/pc_6');
    if (keyBind == "ECHO2x_SHOUT") {
        return cloneCount <= 4;
    }
    if (keyBind == "ECHO2x_SCREAM") {
        return cloneCount > 4;
    }
    if (keyBind == "ECHO2X_BLOCK") {
        return entity.getData("fiskheroes:beam_charge") == 0 && entity.isOnGround();
    }

    if (keyBind == "func_DUPLICATE_ECHO2X") {
        return !entity.getData("fiskheroes:shield");
    }
    if (keyBind == "CHARGED_BEAM") {
        return true;
    }
    if (keyBind == "SHIELD") {
        return entity.getData("fiskheroes:beam_charge") == 0 && entity.isOnGround();
    }

    return false;
}

function getDefaultScale(entity) {
    return 1 - 0.4*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
        return 4;
}

function duplicateEcho2xKey(player, manager) {
    var PC_5 = player.getData('tmf:dyn/pc_5');
    player.playSound("fiskheroes:suit.ironman.nanotech.mk50.cannon.shoot", PC_5 == 0 && player.isSneaking() ? 0 : (PC_5 == 8 && !player.isSneaking() ? 0 : 0.35), 2.2 + 0.4 * Math.random());
    manager.setData(player, 'tmf:dyn/pc_5', PC_5 == 0 && player.isSneaking() ? 0 : (PC_5 == 8 && !player.isSneaking() ? 8 : player.getData('tmf:dyn/pc_5') + (player.isSneaking() ? -1 : 1)));
    manager.setData(player, "tmf:dyn/pc_8", PC_5 == 0 && player.isSneaking() ? 0 : (PC_5 == 8 && !player.isSneaking() ? 0 : 1.0));
    return true;
}
function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function duplicateFuse(entity, blockDistance) {
    var angle = Math.sqrt(Math.pow(entity.rotYaw() - Math.ceil(entity.rotYaw()/360)*360,2));
    var moveLookZ = ((angle >= 315 || angle <= 45) && entity.world().blockAt(entity.pos().add(-blockDistance, 0.5, 0.5)).isSolid());
    var moveLook_Z = ((angle >= 135 && angle <= 225) && entity.world().blockAt(entity.pos().add(blockDistance, 0.5, -0.5)).isSolid());
    var moveLookX = ((angle > 45 && angle < 135) && entity.world().blockAt(entity.pos().add(0.5, 0.5, blockDistance)).isSolid());
    var moveLook_X = ((angle > 225 && angle < 315) && entity.world().blockAt(entity.pos().add(-0.5, 0.5, -blockDistance)).isSolid());

    var moveLookZ2 = ((angle >= 315 || angle <= 45) && entity.isOnGround() &&  !entity.world().blockAt(entity.pos().add(-blockDistance, -0.5, 0.5)).isSolid());
    var moveLook_Z2 = ((angle >= 135 && angle <= 225) && entity.isOnGround() && !entity.world().blockAt(entity.pos().add(blockDistance, -0.5, -0.5)).isSolid());
    var moveLookX2 = ((angle > 45 && angle < 135) && entity.isOnGround() && !entity.world().blockAt(entity.pos().add(0.5, -0.5, blockDistance)).isSolid());
    var moveLook_X2 = ((angle > 225 && angle < 315) && entity.isOnGround() && !entity.world().blockAt(entity.pos().add(-0.5, -0.5, -blockDistance)).isSolid());

    return ((moveLookZ || moveLook_Z || moveLookX || moveLook_X) || (moveLookZ2 || moveLook_Z2 || moveLookX2 || moveLook_X2));
}