var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Omnitrix (Albedo 5 Alien)");
    hero.setTier(9);
    
    hero.setChestplate("Watch");
    
    hero.addPowers("emo:albedo");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 100000, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 9.0, 0);

        //TRANSFORM

        hero.addKeyBind("INSANAZOR", "Humungousaur", 1);
        hero.addKeyBind("JETRAY", "Jetray", 2);
        hero.addKeyBind("XLR", "Chromastone", 3);
        hero.addKeyBind("IGUANA", "Big Chill", 4);
        hero.addKeyBind("ATES", "Swampfire", 5);
   
        //INSANAZOR
        hero.addKeyBind("GROUND_SMASH", "Ground Smash", 2);
        hero.addKeyBind("EARTHQUAKE", "key.earthquake", 3);
    
        //XLR
        hero.addKeyBind("ENERGY_PROJECTION", "Energy Beam", 1);
   
        //JATRAY
        hero.addKeyBind("HEAT_VISION", "Heat Vision", 1);
   
       //IGUANA
       hero.addKeyBind("CHARGED_BEAM", "freeze breath", 1);
       hero.addKeyBind("INTANGIBILITY", "Intangibility", 2);
       hero.addKeyBind("INVISIBILITY", "invisibility", 3);
   
        //ATES
        hero.addKeyBind("AIM", "key.shoot", 1);
    
   
       hero.setModifierEnabled(isModifierEnabled);
       hero.setKeyBindEnabled(isKeyBindEnabled);
       hero.supplyFunction("canAim", canAim);
       hero.setDefaultScale(defaultScale);
       hero.setTierOverride(getTierOverride);
       hero.addAttributeProfile("INSANAZOR", insanazorProfile);
       hero.addAttributeProfile("XLR", xlrProfile);
       hero.addAttributeProfile("JATRAY", jetrayProfile);
       hero.addAttributeProfile("IGUANA", iguanaProfile);
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
   
   function bladeProfile(profile) {
       profile.inheritDefaults();
       profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
   }
   
   function getProfile(entity) {
       return entity.getData("emo:dyn/insanazor") ? "INSANAZOR" : entity.getData("emo:dyn/xlr") ? "XLR" : entity.getData("emo:dyn/jetray") ? "JETRAY" : entity.getData("emo:dyn/iguana") ? "IGUANA" : entity.getData("emo:dyn/ates") ? "ATES" : entity.getData("emo:dyn/waybig") ? "WAYBIG" : entity.getData("emo:dyn/hayalet") ? "HAYALET" : entity.getData("emo:dyn/echo") ? "ECHO" : entity.getData("fiskheroes:blade") ? "BLADE" : null;
   }
   
   function insanazorProfile(profile) {
       profile.addAttribute("FALL_RESISTANCE", 100000, 1);
       profile.addAttribute("PUNCH_DAMAGE", 15, 0);
       profile.addAttribute("SPRINT_SPEED", 0.6, 1);
       profile.addAttribute("MAX_HEALTH", 22.0, 0);
       profile.addAttribute("KNOCKBACK", 6.5, 0);
   }
   
   function xlrProfile(profile) {
       profile.addAttribute("FALL_RESISTANCE", 100000, 1);
       profile.addAttribute("PUNCH_DAMAGE", 10, 0);
       profile.addAttribute("SPRINT_SPEED", 1.3, 1);
       profile.addAttribute("REACH_DISTANCE", 2.8, 1);
       profile.addAttribute("BASE_SPEED_LEVELS", 9.0, 0);
   }
   
   function jetrayProfile(profile) {
       profile.addAttribute("FALL_RESISTANCE", 100000, 1);
       profile.addAttribute("PUNCH_DAMAGE", 9, 0);
       profile.addAttribute("SPRINT_SPEED", 0.8, 1);
       profile.addAttribute("REACH_DISTANCE", 0.8, 1);
   }
   
   function iguanaProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 12, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("MAX_HEALTH", 15.0, 0);
   }
   
   function atesProfile(profile) {
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
       if (entity.getData("emo:dyn/insanazor")) {
           return 9;
       }
       if (entity.getData("emo:dyn/xlr")) {
           return 7;
       }
       if (entity.getData("emo:dyn/jetray")) {
           return 8;
       }
       if (entity.getData("emo:dyn/ates")) {
           return 5;
       }
       if (entity.getData("emo:dyn/iguana")) {
           return 8;
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
           case "fiskheroes:leaping":
               return entity.getData("emo:dyn/jetray")
           case "fiskheroes:arrow_catching":
               return entity.getData("emo:dyn/insanazor")
           case "fiskheroes:controlled_flight":
               return entity.getData("emo:dyn/iguana");
           case "fiskheroes:aim":
               return entity.getData("emo:dyn/ates");
           case "fiskheroes:fireball":
               return entity.getData("emo:dyn/ates");
           case "fiskheroes:heat_vision":
               return entity.getData("emo:dyn/jetray");
           case "fiskheroes:charged_beam":
                return entity.getData("emo:dyn/iguana");
            case "fiskheroes:invisibility":
                return entity.getData("emo:dyn/iguana");
            case "fiskheroes:intangibility":
                return entity.getData("emo:dyn/iguana");
           case "fiskheroes:cryo_charge":
                return entity.getData("emo:dyn/iguana");
           case "fiskheroes:gliding":
               return entity.getData("emo:dyn/jetray");
           case "fiskheroes:flight":
               return entity.getData("emo:dyn/hayalet");
           case "fiskheroes:super_speed":
               return entity.getData("emo:dyn/xlr");
           case "fiskheroes:slow_motion":
               return entity.getData("emo:dyn/xlr");
           case "fiskheroes:spellcasting":
               return entity.getData("emo:dyn/echo");
           case "fiskheroes:sonic_waves":
               return entity.getData("emo:dyn/echo");
           default:
               return true;
       }
   }
   
   function isKeyBindEnabled(entity, keyBind) {
       switch (keyBind) {
           case "EARTHQUAKE":
               return entity.getData("emo:dyn/insanazor");
           case "SUPER_SPEED":
               return entity.getData("emo:dyn/waybig");
           case "SLOW_MOTION":
               return entity.getData("emo:dyn/waybig");
           case "CHARGED_BEAM":
               return entity.getData("emo:dyn/iguana");
           case "CHARGE_ICE":
               return entity.getData("emo:dyn/iguana");
              case "HEAT_VISION":
               return entity.getData("emo:dyn/jetray");
           case "GROUND_SMASH":
               return entity.getData("emo:dyn/insanazor");
           case "BLADE":
               return entity.getData("emo:dyn/iguana");
           case "AIM":
               return entity.getData("emo:dyn/ates");
           case "ENERGY_PROJECTION":
               return entity.getData("emo:dyn/xlr");
           case "INTANGIBILITY":
               return entity.getData("emo:dyn/iguana");
           case "INVISIBILITY":
               return entity.getData("emo:dyn/iguana");
           case "UTILITY_BELT":
               return entity.getData("emo:dyn/hayalet");
           case "SONIC_WAVES":
               return entity.getData("emo:dyn/echo");
           case "SPELL_MENU":
               return entity.getData("emo:dyn/echo");
   
           case "INSANAZOR":
               return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/ates")
           case "XLR":
               return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/ates")
           case "JETRAY":
               return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/insanazor") && !entity.getData("emo:dyn/xlr") && !entity.getData("emo:dyn/iguana") && !entity.getData("emo:dyn/ates")
           case "IGUANA":
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
        return 1.8;
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
        return "INSANAZOR";
    }
    if (entity.getData("emo:dyn/jetrey")) {
        return "JETRAY";
    }
    if (entity.getData("emo:dyn/xlr")) {
        return "XLR";
    }
    if (entity.getData("emo:dyn/iguana")) {
        return "IGUANA";
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
