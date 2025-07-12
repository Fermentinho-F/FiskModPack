function init(hero) {
    hero.setName("Generator Rex");
    hero.setTier(5);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("emo:rex");
    hero.addAttribute("JUMP_HEIGHT", 2.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 9000.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SWORD", "Big Fat Sword", 1);
     hero.addKeyBind("EL", "Smack hands", 2);
     hero.addKeyBind("BOOGIE", "Boogie Pack", 3);
     hero.addKeyBind("SWORDEL", "Big Fat Sword And Smack hand", 4);
    hero.addKeyBind("AIM", "Upgraded Cannon", 5);

//EL
hero.addKeyBind("GROUND_SMASH", "Ground Smash", 1);

 
//SWORDEL
hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);

     hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("SWORD", swordProfile);
    hero.addAttributeProfile("EL", elProfile);
    hero.addAttributeProfile("SWORDEL", swordelProfile);
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
}


function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
}

function getProfile(entity) {
    return entity.getData("emo:dyn/sword") ? "SWORD" : entity.getData("emo:dyn/el") ? "EL" : entity.getData("emo:dyn/swordel") ? "SWORDEL" : entity.getData("fiskheroes:blade") ? "BLADE" : null;
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

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:leaping":
            return entity.getData("emo:dyn/boogie")
        case "fiskheroes:controlled_flight":
            return entity.getData("emo:dyn/boogie");
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
        case "SWORDEL":
            return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/jetray") && !entity.getData("emo:dyn/ates")
        case "AIM":
            return !entity.getData("emo:dyn/next") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/el") && !entity.getData("emo:dyn/swordel") && !entity.getData("emo:dyn/ates")
                
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
    return true;
}


function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
