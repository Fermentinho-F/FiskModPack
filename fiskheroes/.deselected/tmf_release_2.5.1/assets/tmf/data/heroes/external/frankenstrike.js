function init(hero) {

    hero.addKeyBind("CHARGED_BEAM", "key.mantaRays", 1);
    hero.addKeyBind("CHARGED_BEAM1FRANKENSTRIKE", "Charge Twin-Towers", 1);

    hero.addAttributeProfile("FRANKENSTRIKE", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.9, 1);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("WEAPON_DAMAGE", -2.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("KNOCKBACK", 1, 0);
        profile.addAttribute("STEP_HEIGHT", 0.5, 0);
        profile.addAttribute("MAX_HEALTH", -3, 0);
    });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }

}

function getAttributeProfile(entity) {
    return "FRANKENSTRIKE";
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("frankenstrike");

    if (modifier.id() == "frankenstrike_3") {
        return SL >= 60;
    }

    return true; 
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("frankenstrike");

    if (keyBind == "CHARGED_BEAM1FRANKENSTRIKE") {
        return SL >= 15;
    }
    if (keyBind == "CHARGED_BEAM") {
        return SL >= 15;
    }

    return false;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function getDefaultScale(entity) {
    return 1.0 + 0.425*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 8;
}
