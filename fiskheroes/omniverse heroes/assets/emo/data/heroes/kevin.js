var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Kevin Levin");
    hero.setTier(7);
    
    hero.setChestplate("suit");
    
    hero.addPowers("emo:kevin");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 100000, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 9.0, 0);

     //TRANSFORM

     hero.addKeyBind("DEMIR", "Iron Form", 1);
     hero.addKeyBind("TAS", "Stone Form", 2);
     hero.addKeyBind("ELMAS", "Diamond Form", 3);
     hero.addKeyBind("MAGMA", "Magma Form", 4);
     hero.addKeyBind("ZUMRUT", "Emerald Form", 5);

     //DEMIR
     hero.addKeyBind("BLADE", "Blade", 2);

 
     //TAS
     hero.addKeyBind("SHIELD", "Arm Shield", 1);
 

     //MAGMA
     hero.addKeyBind("AIM", "key.shoot", 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("DEMIR", demirProfile);
    hero.addAttributeProfile("TAS", tasProfile);
    hero.addAttributeProfile("ELMAS", elmasProfile);
    hero.addAttributeProfile("MAGMA", magmaProfile);
    hero.addAttributeProfile("ZUMRUT", zumrutProfile);
    hero.addAttributeProfile("WAYBIG", waybigProfile);
    hero.addAttributeProfile("HAYALET", hayaletProfile);
    hero.addAttributeProfile("ECHO", echoProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
        }
    });
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}


function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 18.0, 0);
}

function getProfile(entity) {
    return entity.getData("emo:dyn/demir") ? "DEMIR" : entity.getData("emo:dyn/tas") ? "TAS" : entity.getData("emo:dyn/elmas") ? "ELMAS" : entity.getData("emo:dyn/magma") ? "MAGMA" : entity.getData("emo:dyn/zumrut") ? "ZUMRUT" : entity.getData("emo:dyn/waybig") ? "WAYBIG" : entity.getData("emo:dyn/hayalet") ? "HAYALET" : entity.getData("emo:dyn/echo") ? "ECHO" : entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function demirProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    profile.addAttribute("SPRINT_SPEED", 4.6, 1);
    profile.addAttribute("JUMP_HEIGHT", 5.0, 0);
}

function tasProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 12.5, 0);
    profile.addAttribute("BASE_SPEED", -0.25, 1);
}

function elmasProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 15, 0);
    profile.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    profile.addAttribute("SPRINT_SPEED", 7.15, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.5, 0);
}

function zumrutProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 14, 0);
    profile.addAttribute("SPRINT_SPEED", 0.9, 1);
    profile.addAttribute("JUMP_HEIGHT", 4.0, 0);
    profile.addAttribute("SPRINT_SPEED", 7.45, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.5, 1);

}

function magmaProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute ("JUMP_HEIGHT", 4.1, 0);
}

function waybigProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 30, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("REACH_DISTANCE", 0.8, 1);
    profile.addAttribute("MAX_HEALTH", 29.0, 0);
}

function hayaletProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 12, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("MAX_HEALTH", 15.0, 0);
}

function echoProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
}

function getTierOverride(entity) {
    if (entity.getData("emo:dyn/elmas")) {
        return 9;
    }
    if (entity.getData("emo:dyn/tas")) {
        return 5;
    }
    if (entity.getData("emo:dyn/zumrut")) {
        return 9;
    }
    if (entity.getData("emo:dyn/ates")) {
        return 3;
    }
    if (entity.getData("emo:dyn/magma")) {
        return 7;
    }
    if (entity.getData("emo:dyn/waybig")) {
        return 10;
    }
    if (entity.getData("emo:dyn/demir")) {
        return 6;
    }
    if (entity.getData("emo:dyn/echo")) {
        return 6;
    }

    return 2;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:web_swinging":
            return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
        case "fiskheroes:leaping":
            return entity.getData("emo:dyn/magma")
        case "fiskheroes:arrow_catching":
            return entity.getData("emo:dyn/insanazor")
        case "fiskheroes:controlled_flight":
            return entity.getData("emo:dyn/magma");
        case "fiskheroes:aim":
            return entity.getData("emo:dyn/magma");
        case "fiskheroes:fireball":
            return entity.getData("emo:dyn/magma");
        case "fiskheroes:heat_vision":
            return entity.getData("emo:dyn/insanazor");
        case "fiskheroes:charged_beam":
             return entity.getData("emo:dyn/insanazor");
        case "fiskheroes:cryo_charge":
             return entity.getData("emo:dyn/echo");
        case "fiskheroes:gliding":
            return entity.getData("emo:dyn/ates");
        case "fiskheroes:flight":
            return entity.getData("emo:dyn/jetray");
        case "fiskheroes:super_speed":
            return entity.getData("emo:dyn/xlr");
        case "fiskheroes:slow_motion":
            return entity.getData("emo:dyn/xlr");
        case "fiskheroes:spellcasting":
            return entity.getData("emo:dyn/xlr");
        case "fiskheroes:lightning_cast":
            return entity.getData("emo:dyn/xlr");
        case "fiskheroes:sonic_waves":
            return entity.getData("emo:dyn/ates");
        case "fiskheroes:invisibility":
            return entity.getData("emo:dyn/jetray");
        case "fiskheroes:intangibility":
            return entity.getData("emo:dyn/jetray");
        case "fiskheroes:blade":
            return entity.getData("emo:dyn/demir");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "EARTHQUAKE":
            return entity.getData("emo:dyn/insanazor");
        case "SUPER_SPEED":
            return entity.getData("emo:dyn/xlr");
        case "SLOW_MOTION":
            return entity.getData("emo:dyn/xlr");
        case "CHARGED_BEAM":
            return entity.getData("emo:dyn/insanazor");
        case "CHARGE_ICE":
            return entity.getData("emo:dyn/iguana");
           case "HEAT_VISION":
            return entity.getData("emo:dyn/insanazor");
        case "GROUND_SMASH":
            return entity.getData("emo:dyn/insanazor");
        case "BLADE":
            return entity.getData("emo:dyn/demir");
        case "SHIELD":
            return entity.getData("emo:dyn/tas");
        case "AIM":
            return entity.getData("emo:dyn/magma");
        case "ENERGY_PROJECTION":
            return entity.getData("emo:dyn/jetray");
        case "INTANGIBILITY":
            return entity.getData("emo:dyn/jetray");
        case "TELEKINESIS":
            return entity.getData("emo:dyn/jetray");
        case "INVISIBILITY":
            return entity.getData("emo:dyn/jetray");
        case "UTILITY_BELT":
            return entity.getData("emo:dyn/iguana");
        case "SONIC_WAVES":
            return entity.getData("emo:dyn/echo");
        case "SPELL_MENU":
            return entity.getData("emo:dyn/xlr");
        case "WEB_ZIP":
            return entity.getData("emo:dyn/iguana");
        case "func_WEB_SWINGING":
            return entity.getData("emo:dyn/iguana");


            case "DEMIR":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/tas") && !entity.getData("emo:dyn/magma") && !entity.getData("emo:dyn/elmas") && !entity.getData("emo:dyn/zumrut")
            case "TAS":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/demir") && !entity.getData("emo:dyn/magma") && !entity.getData("emo:dyn/elmas") && !entity.getData("emo:dyn/zumrut")
            case "ELMAS":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/tas") && !entity.getData("emo:dyn/magma") && !entity.getData("emo:dyn/demir") && !entity.getData("emo:dyn/zumrut")
            case "MAGMA":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/tas") && !entity.getData("emo:dyn/demir") && !entity.getData("emo:dyn/elmas") && !entity.getData("emo:dyn/zumrut")
            case "ZUMRUT":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/tas") && !entity.getData("emo:dyn/magma") && !entity.getData("emo:dyn/elmas") && !entity.getData("emo:dyn/demir")
                

        case "NEXT":
            return !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/echo") &&  !entity.getData("emo:dyn/ates") && !entity.getData("emo:dyn/waybig") && !entity.getData("emo:dyn/hayalet")
    

        case "ECHO":
            return entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/ates") && !entity.getData("emo:dyn/waybig") && !entity.getData("emo:dyn/hayalet")    
         case "WAYBIG":
            return entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/echo") && !entity.getData("emo:dyn/ates") && !entity.getData("emo:dyn/hayalet")
        case "HAYALET":
            return entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/echo") && !entity.getData("emo:dyn/ates") && !entity.getData("emo:dyn/waybig")

            default:
            return true;
    }

}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    if (entity.getData("emo:dyn/demir")) {
        return "DEMIR";
    }
    if (entity.getData("emo:dyn/tas")) {
        return "TAS";
    }
    if (entity.getData("emo:dyn/elmas")) {
        return "ELMAS";
    }
    if (entity.getData("emo:dyn/magma")) {
        return "MAGMA";
    }
    if (entity.getData("emo:dyn/zumrut")) {
        return "ZUMRUT";
    }
    if (entity.getData("emo:dyn/waybig")) {
        return "WAYBIG";
    }
    if (entity.getData("emo:dyn/hayalet")) {
        return "HAYALET";
    }
    if (entity.getData("emo:dyn/echo")) {
        return "ECHO";
    }
    return true;
}


function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
