var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Herotrix (Super Hero DNA)");
    hero.setTier(9);
    
    hero.setChestplate("Watch");
    
    hero.addPowers("emo:herotrix");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 100000, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 9.0, 0);

     //TRANSFORM

     hero.addKeyBind("KRYPTONIAN", "Lord Kryptonian", 1);
     hero.addKeyBind("MARTIAN", "Red Martian", 2);
     hero.addKeyBind("SPEEDSTER", "Pinky Speedy", 3);
     hero.addKeyBind("SPIDER", "Yellow Spider", 4);
     hero.addKeyBind("ATES", "Omnifire", 5);

     //KRYPTONIAN
     hero.addKeyBind("HEAT_VISION", "Heat Vision", 2);
     hero.addKeyBind("CHARGED_BEAM", "freeze breath", 3);
     hero.addKeyBind("GROUND_SMASH", "Ground Smash", 4);
     hero.addKeyBind("EARTHQUAKE", "key.earthquake", 5);
 
     //SPEEDSTER
     hero.addKeyBind("SUPER_SPEED", "Super speed", 1);
     hero.addKeyBind("SLOW_MOTION", "Slow Motion", 2);
     hero.addKeyBind("SPELL_MENU", "clones", 4);

 
     //MARTIAN
     hero.addKeyBind("TELEKINESIS", "Martian telekinesis", 1);
     hero.addKeyBind("INTANGIBILITY", "Intangibility", 3);
     hero.addKeyBind("INVISIBILITY", "Invisibility", 4);
     hero.addKeyBind("ENERGY_PROJECTION", "Heat Vision", 5);

     //SPIDER
     hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
     hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
     hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);

     //ATES
     hero.addKeyBind("AIM", "key.shoot", 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setDefaultScale(defaultScale);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("KRYPTONIAN", insanazorProfile);
    hero.addAttributeProfile("SPEEDSTER", xlrProfile);
    hero.addAttributeProfile("MARTIAN", jetrayProfile);
    hero.addAttributeProfile("SPIDER", iguanaProfile);
    hero.addAttributeProfile("ATES", atesProfile);
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
            "COLD": 0.4
        }
    });

    hero.setTickHandler((entity, manager) => {
        if (entity.getHealth() < 7) 
        {
          manager.setData(entity, "fiskheroes:energy_charging", true);
        } else {
          manager.setData(entity, "fiskheroes:energy_charging", false);
        }
        if (entity.getHealth() < 6) 
        {
          manager.setData(entity, "fiskheroes:shield_blocking", true);
        } else {
          manager.setData(entity, "fiskheroes:shield_blocking", false);
        }
        if (entity.getHealth() < 5) 
        {
          manager.setData(entity, "fiskheroes:shadowform", true);
        } else {
          manager.setData(entity, "fiskheroes:shadowform", false);
        }
        utils.flightOnIntangibility(entity, manager);
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
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
}

function getProfile(entity) {
    return entity.getData("emo:dyn/insanazor") ? "KRYPTONIAN" : entity.getData("emo:dyn/xlr") ? "SPEEDSTER" : entity.getData("emo:dyn/jetray") ? "MARTIAN" : entity.getData("emo:dyn/iguana") ? "SPIDER" : entity.getData("emo:dyn/ates") ? "ATES" : entity.getData("emo:dyn/waybig") ? "WAYBIG" : entity.getData("emo:dyn/hayalet") ? "HAYALET" : entity.getData("emo:dyn/echo") ? "ECHO" : entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function insanazorProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 15, 0);
    profile.addAttribute("SPRINT_SPEED", 5.6, 1);
    profile.addAttribute("JUMP_HEIGHT", 5.0, 0);
    profile.addAttribute("KNOCKBACK", 6.5, 0);
}

function xlrProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    profile.addAttribute("SPRINT_SPEED", 1.3, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
    profile.addAttribute("BASE_SPEED_LEVELS", 7.0, 0);
}

function jetrayProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 9, 0);
    profile.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.15, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
}

function iguanaProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 8, 0);
    profile.addAttribute("SPRINT_SPEED", 0.9, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.45, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("IMPACT_DAMAGE", 0.5, 1);

}

function atesProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute ("JUMP_HEIGHT", 5.1, 0);
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
    if (entity.getData("emo:dyn/insanazor")) {
        return 9;
    }
    if (entity.getData("emo:dyn/xlr")) {
        return 5;
    }
    if (entity.getData("emo:dyn/jetray")) {
        return 9;
    }
    if (entity.getData("emo:dyn/ates")) {
        return 3;
    }
    if (entity.getData("emo:dyn/iguana")) {
        return 7;
    }
    if (entity.getData("emo:dyn/waybig")) {
        return 10;
    }
    if (entity.getData("emo:dyn/hayalet")) {
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
            return entity.getData("emo:dyn/insanazor")
        case "fiskheroes:arrow_catching":
            return entity.getData("emo:dyn/insanazor")
        case "fiskheroes:controlled_flight":
            return entity.getData("emo:dyn/insanazor");
        case "fiskheroes:aim":
            return entity.getData("emo:dyn/echo");
        case "fiskheroes:fireball":
            return entity.getData("emo:dyn/ates");
        case "fiskheroes:heat_vision":
            return entity.getData("emo:dyn/insanazor");
        case "fiskheroes:charged_beam":
             return entity.getData("emo:dyn/insanazor");
        case "fiskheroes:cryo_charge":
             return entity.getData("emo:dyn/echo");
        case "fiskheroes:gliding":
            return entity.getData("emo:dyn/ates");
        case "fiskheroes:propelled_flight":
            return entity.getData("fiskheroes:shadowform");
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
        case "fiskheroes:equipment":
            return entity.getData("emo:dyn/iguana");
        case "fiskheroes:shield":
            return entity.getData("emo:dyn/koruma");
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
            return entity.getData("emo:dyn/iguana");
        case "AIM":
            return entity.getData("emo:dyn/ates");
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
        


            case "KRYPTONIAN":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/ates")
            case "SPEEDSTER":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/ates")
            case "MARTIAN":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/ates")
            case "SPIDER":
                return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/ates")
            case "ATES":
                    return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana")
                

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
function defaultScale(entity) {
    if (entity.getData("emo:dyn/insanazor")) {
        return 1.0;
    }
    if (entity.getData("emo:dyn/jetray")) {
        return 1.0;
    }
    if (entity.getData("emo:dyn/xlr")) {
        return 1.0;
    }
    if (entity.getData("emo:dyn/iguana")) {
        return 1.0;
    }
    if (entity.getData("emo:dyn/ates")) {
        return 1.0;
    }
    if (entity.getData("emo:dyn/waybig")) {
        return 18.9;
    }
    if (entity.getData("emo:dyn/hayalet")) {
        return 1.1;
    }
    if (entity.getData("emo:dyn/echo")) {
        return 1.0;
    }
    return 1.0;
}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    if (entity.getData("emo:dyn/insanazor")) {
        return "KRYPTONIAN";
    }
    if (entity.getData("emo:dyn/jetrey")) {
        return "MARTIAN";
    }
    if (entity.getData("emo:dyn/xlr")) {
        return "SPEEDSTER";
    }
    if (entity.getData("emo:dyn/iguana")) {
        return "SPIDER";
    }
    if (entity.getData("emo:dyn/ates")) {
        return "ATES";
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
