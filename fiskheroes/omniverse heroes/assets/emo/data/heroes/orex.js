var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Generator Rex (Omega 1 Nanite)");
    hero.setTier(7);
    
    hero.setChestplate("suit");
    
    hero.addPowers("emo:omega");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 100000, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 9.0, 0);

     //TRANSFORM

     hero.addKeyBind("SWORD", "Big Fat Sword", 1);
     hero.addKeyBind("EL", "Smack hands", 2);
     hero.addKeyBind("BOOGIE", "Boogie Pack", 3);
     hero.addKeyBind("SWORDEL", "Big Fat Sword And Smack hand", 4);
     hero.addKeyBind("NEXT", "Omega Nanite", 5);
 
     hero.addKeyBind("BLAST", "Blast caster", 1);
     hero.addKeyBind("FUNCHUCKS", "Funchucks", 2);
     hero.addKeyBind("AXES", "Bad axes", 3);
     hero.addKeyBind("PARTY", "Block party", 4);

     //EL
     hero.addKeyBind("GROUND_SMASH", "Ground Smash", 1);

 
     //SWORDEL
     hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);


     //FUNCHUCKS
     hero.addKeyBind("CHARGED_BEAM", "Clap", 1);


     //PARTY
     hero.addKeyBind("SHIELD", "Energy Shield", 1);


    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("SWORD", swordProfile);
    hero.addAttributeProfile("EL", elProfile);
    hero.addAttributeProfile("SWORDEL", swordelProfile);
    hero.addAttributeProfile("BLAST", blastProfile);
    hero.addAttributeProfile("FUNCHUCKS", funchucksProfile);
    hero.addAttributeProfile("AXES", axesProfile);
    hero.addAttributeProfile("PARTY", partyProfile);
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
    hero.addDamageProfile("BLAST", {
        "properties": {
            "EFFECTS": [{
                    "id": "minecraft:poison",
                    "duration": 100,
                    "amplifier": 3
                }
            ]
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
}

function getProfile(entity) {
    return entity.getData("emo:dyn/sword") ? "SWORD" : entity.getData("emo:dyn/el") ? "EL" : entity.getData("emo:dyn/swordel") ? "SWORDEL" : entity.getData("emo:dyn/blast") ? "BLAST" : entity.getData("emo:dyn/funchucks") ? "FUNCHUCKS" : entity.getData("emo:dyn/axes") ? "AXES" : entity.getData("emo:dyn/party") ? "PARTY" : entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function swordProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 35.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
}

function elProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 30.0, 0);
    profile.addAttribute("KNOCKBACK", 6.5, 0);
}

function swordelProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 37.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("KNOCKBACK", 6.5, 0);

}

function blastProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 31.0, 0);
    profile.addAttribute("KNOCKBACK", 6.5, 0);
}

function funchucksProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 33, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
}

function axesProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 40.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
}

function partyProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 10, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
}


function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:leaping":
            return entity.getData("emo:dyn/boogie")
        case "fiskheroes:controlled_flight":
            return entity.getData("emo:dyn/boogie");
        case "fiskheroes:aim":
            return entity.getData("emo:dyn/ates");
        case "fiskheroes:fireball":
            return entity.getData("emo:dyn/ates");
        case "fiskheroes:heat_vision":
            return entity.getData("emo:dyn/jetray");
        case "fiskheroes:charged_beam":
             return entity.getData("emo:dyn/funchucks");
        case "fiskheroes:cryo_charge":
             return entity.getData("emo:dyn/iguana");
        case "fiskheroes:gliding":
            return entity.getData("emo:dyn/ates");
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
            return entity.getData("emo:dyn/swordel");
        case "SUPER_SPEED":
            return entity.getData("emo:dyn/xlr");
        case "SLOW_MOTION":
            return entity.getData("emo:dyn/xlr");
        case "CHARGED_BEAM":
            return entity.getData("emo:dyn/funchucks");
        case "CHARGE_ICE":
            return entity.getData("emo:dyn/iguana");
           case "HEAT_VISION":
            return entity.getData("emo:dyn/jetray");
        case "GROUND_SMASH":
            return entity.getData("emo:dyn/el");
        case "BLADE":
            return entity.getData("emo:dyn/iguana");
        case "AIM":
            return entity.getData("emo:dyn/ates");
        case "ENERGY_PROJECTION":
            return entity.getData("emo:dyn/waybig");
        case "INTANGIBILITY":
            return entity.getData("emo:dyn/hayalet");
        case "INVISIBILITY":
            return entity.getData("emo:dyn/hayalet");
        case "UTILITY_BELT":
            return entity.getData("emo:dyn/insanazor");
        case "SONIC_WAVES":
            return entity.getData("emo:dyn/echo");
        case "SPELL_MENU":
            return entity.getData("emo:dyn/echo");
        case "SHIELD":
            return entity.getData("emo:dyn/party");

        case "SWORD":
            return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/ates")
        case "EL":
            return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/ates")
        case "BOOGIE":
            return !entity.getData("emo:dyn/next")
       case "SWORDEL":
            return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/ates")
        
        case "NEXT":
            return !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/boogie") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/blast") &&  !entity.getData("emo:dyn/funchucks") && !entity.getData("emo:dyn/axes") && !entity.getData("emo:dyn/party")
    

        case "BLAST":
            return entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/boogie") && !entity.getData("emo:dyn/funchucks") && !entity.getData("emo:dyn/axes") && !entity.getData("emo:dyn/party")    
        case "FUNCHUCKS":
            return entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/boogie") && !entity.getData("emo:dyn/blast") && !entity.getData("emo:dyn/axes") && !entity.getData("emo:dyn/party")    
        case "AXES":
            return entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/boogie") && !entity.getData("emo:dyn/funchucks") && !entity.getData("emo:dyn/blast") && !entity.getData("emo:dyn/party")    
        case "PARTY":
            return entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/boogie") && !entity.getData("emo:dyn/funchucks") && !entity.getData("emo:dyn/axes") && !entity.getData("emo:dyn/blast")    

            default:
            return true;
    }

}


function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
    if (entity.getData("emo:dyn/sword")) {
        return "SWORD";
    }
    if (entity.getData("emo:dyn/boogie")) {
        return "BOOGIE";
    }
    if (entity.getData("emo:dyn/el")) {
        return "EL";
    }
    if (entity.getData("emo:dyn/swordel")) {
        return "SWORDEL";
    }
    if (entity.getData("emo:dyn/blast")) {
        return "BLAST";
    }
    if (entity.getData("emo:dyn/funchucks")) {
        return "FUNCHUCKS";
    }
    if (entity.getData("emo:dyn/axes")) {
        return "AXES";
    }
    if (entity.getData("emo:dyn/party")) {
        return "PARTY";
    }
    return true;
}


function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
