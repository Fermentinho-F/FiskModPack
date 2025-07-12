function init(hero) {
    hero.addKeyBind("BLITZWOLFER_SHOUT", "Sonic-Scream", 1);

    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBindFunc("func_BLITZWOLFER", blitzwolferKey, "Rage", 4);

    hero.addAttributeProfile("BLITZWOLFER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.6, 1);
        profile.addAttribute("WEAPON_DAMAGE", -3.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addAttributeProfile("BLITZWOLFER_RAGE", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 9.5, 0);
        profile.addAttribute("BASE_SPEED", 0.8, 1);
        profile.addAttribute("FALL_RESISTANCE", 0.8, 1);
        profile.addAttribute("WEAPON_DAMAGE", -3.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("MAX_HEALTH", -2, 0);
    });

    hero.addDamageProfile("BLITZWOLFER", {
        "types": {
            "BLUNT": 1.0,
            "SHARP": 0.9
        }
    });
}

function getDamageProfile(entity) {
    return "BLITZWOLFER";
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var P1 = entity.getData("tmf:dyn/p_1");
    var P3 = entity.getData("tmf:dyn/p_3");
    var PT1 = entity.getData("tmf:dyn/pt_1");
    var PC1 = entity.getData("tmf:dyn/pc_1");
    var mot = Math.sqrt(Math.pow(entity.motionInterpolated().x(),2) + Math.pow(entity.motionInterpolated().z(), 2));

    manager.incrementData(entity, "tmf:dyn/pt_1", 10, 5, P1, !P1);
    manager.incrementData(entity, "tmf:dyn/pc_1", 500, 250, P1, !P1);

    if (entity.isSneaking() && (P1 || PT1 != 0)) {
        manager.setData(entity, 'tmf:dyn/pt_1', 0);
    }

    if (PC1 == 1) {
        manager.setData(entity, 'tmf:dyn/p_1', false);
    }

    if (PT1 == 1 && entity.isSprinting() && mot >= 0.8) {
        manager.setData(entity, 'tmf:dyn/p_3', true);
    }
    if (P3 && !entity.isOnGround()) {
        manager.setData(entity, 'fiskheroes:heat_vision', true);   
    }
    if ((P3 && entity.isOnGround()) || !P1) {
        manager.setData(entity, 'tmf:dyn/p_3', false);
        manager.setData(entity, 'fiskheroes:heat_vision', false);      
    }

}

function getAttributeProfile(entity) {
    return entity.getData("tmf:dyn/pt_1") != 0 ? "BLITZWOLFER_RAGE" : "BLITZWOLFER";
}

function isModifierEnabled(entity, modifier) {
    var PT1 = entity.getData("tmf:dyn/pt_1");

    if (modifier.id() == "blitzwolfer_0") {
        return  (PT1 == 1);
    }
    if (modifier.id() == "blitzwolfer_5") {
        return  (entity.rotPitch() == 90 && entity.getData('fiskheroes:beam_charge') == 1 && entity.ticksExisted() % 3 == 0);
    }

    return true; 
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("blitzwolfer");

    if (keyBind == "BLITZWOLFER_SHOUT") {
        return SL >= 60;
    }

    if (keyBind == "CHARGED_BEAM") {
        return SL >= 60;
    }
    if (keyBind == "func_BLITZWOLFER") {
        return SL >= 15;
    }
    return false;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function getDefaultScale(entity) {
    return 1 + 0.25*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 7;
}

function blitzwolferKey(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", !player.getData('tmf:dyn/p_1'));
    return true;
}
