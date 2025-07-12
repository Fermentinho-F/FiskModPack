function init(hero) {
    hero.addKeyBind("CHARGE_ICE", "Charge Shards", 1);

    hero.addAttributeProfile("DIAMOND_MATTER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -3.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 6.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
    });

    hero.addDamageProfile("DIAMONDHEAD", {
        "types": {
            "BLUNT": 1.0,
            "SHARP": 0.75
        }
    });

}

function getAttributeProfile(entity) {
    return "DIAMOND_MATTER";
}

function getDamageProfile(entity) {
    return "DIAMONDHEAD";
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
}

function isKeyBindEnabled(entity, keyBind) {

    if (keyBind == "CHARGE_ICE") {
        return true;
    }

    return false;
}

function getDefaultScale(entity) {
    return 1 - 0.55*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 6;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}