function init(hero) {
    hero.addKeyBind("HEAT_VISION_DITTO_1", "Spin", 1); 

    hero.addKeyBind("HEAT_VISION", "Aim", 1); 
    hero.addKeyBindFunc("func_DUPLICATE_DITTO", duplicateDittoKey, "Dupe", 4);

    hero.addAttributeProfile("DITTO1", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 2.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    });

    hero.addAttributeProfile("DITTO2", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("DITTO3", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", -4, 0);
    });
    hero.addAttributeProfile("DITTO4", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", -6, 0);
    });
    hero.addAttributeProfile("DITTO5", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 6.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", -8, 0);
    });
    hero.addAttributeProfile("DITTO6", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", -10, 0);
    });
    hero.addAttributeProfile("DITTO7", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("MAX_HEALTH", -12, 0);
    });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var clone1 = entity.getData('tmf:dyn/pc_5') >= 1;
    var clone2 = entity.getData('tmf:dyn/pc_5') >= 2;
    var clone3 = entity.getData('tmf:dyn/pc_5') >= 3;
    var clone4 = entity.getData('tmf:dyn/pc_5') >= 4;
    var clone5 = entity.getData('tmf:dyn/pc_5') >= 5;
    var clone6 = entity.getData('tmf:dyn/pc_5') >= 6;

    var clonesCompressed = (clone1 && duplicateFuse(entity, 1))+(clone2 && duplicateFuse(entity, -1))+(clone3 && duplicateFuse(entity, 2))+(clone4 && duplicateFuse(entity, -2))+(clone5 && duplicateFuse(entity, 1))+(clone6 && duplicateFuse(entity, -1));

    manager.incrementData(entity, "tmf:dyn/pt_1", 20, 20, clone1 && !duplicateFuse(entity, 1));
    manager.incrementData(entity, "tmf:dyn/pc_1", 20, 20, clone2 && !duplicateFuse(entity, -1));
    manager.incrementData(entity, "tmf:dyn/pt_3", 20, 20, clone3 && !duplicateFuse(entity, 2));
    manager.incrementData(entity, "tmf:dyn/pc_3", 20, 20, clone4 && !duplicateFuse(entity, -2));
    manager.incrementData(entity, "tmf:dyn/pt_4", 20, 20, clone5 && !duplicateFuse(entity, 1));
    manager.incrementData(entity, "tmf:dyn/pc_4", 20, 20, clone6 && !duplicateFuse(entity, -1));

    manager.incrementData(entity, "tmf:dyn/pt_6", 10, entity.getData('fiskheroes:heat_vision'));

    if (entity.getData("fiskheroes:flying")) {
        manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
    }
    manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);

    if (entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:heat_vision") || entity.getData('tmf:dyn/timeout')) {
        manager.setInterpolatedData(entity, "tmf:dyn/pc_5", 0);
    }
    entity.playSound("tmf:ditto.splitting", entity.getData("tmf:dyn/pc_6") != clonesCompressed ? 0.6 : 0, 0.9 + 0.2 * Math.random());

    manager.setData(entity, "tmf:dyn/pc_6", clonesCompressed);
}

function getAttributeProfile(entity) {
    return "DITTO"+(1+entity.getData('tmf:dyn/pc_5') - entity.getData('tmf:dyn/pc_6'));
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ditto");
    var PT1 = entity.getData('tmf:dyn/pt_1');

    if (modifier.id() == "ditto_0") {
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0 && !entity.getData("fiskheroes:heat_vision");
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ditto");
    if (keyBind == "HEAT_VISION_DITTO_1") {
        return SL >= 15;
    }

    if (keyBind == "func_DUPLICATE_DITTO") {
        return SL >= 60;
    }
    if (keyBind == "HEAT_VISION") {
        return SL >= 15;
    }

    return false;
}

function getDefaultScale(entity) {
    return 1 - 0.25*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
        return 3;
}

function duplicateDittoKey(player, manager) {
    var PC_5 = player.getData('tmf:dyn/pc_5');
    player.playSound("tmf:ditto.splitting", PC_5 == 0 && player.isSneaking() ? 0 : (PC_5 == 6 && !player.isSneaking() ? 0 : 0.6), 0.9 + 0.2 * Math.random());
    manager.setData(player, 'tmf:dyn/pc_5', PC_5 == 0 && player.isSneaking() ? 0 : (PC_5 == 6 && !player.isSneaking() ? 6 : player.getData('tmf:dyn/pc_5') + (player.isSneaking() ? -1 : 1)));
    return true;
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