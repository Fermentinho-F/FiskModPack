var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Sadao Mao (the devil part time)");
    hero.setTier(10);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("fiskheroes:vibranium_physiology", "emo:soa");
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4000.0, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);

    hero.addKeyBind("CHARGED_BEAM", "Energy Blast", 1);
    hero.addKeyBind("SHIELD", "Shield", 2);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 3);
    hero.addKeyBind("SWORD", "Demonic Sword", 4);
    hero.addKeyBind("NEXT", "Other powers", 5);


    hero.addKeyBind("AIM", "key.gravityManip", 1);
    hero.addKeyBind("GRAVITY_MANIPULATION", "key.gravityManip", 1);
    hero.addKeyBind("TELEPORT", "Teleport", 2);
    hero.addKeyBind("INVISIBILITY", "Demonic Invisibility", 3);
    hero.addKeyBind("SPELL_MENU", "Magic Menu", 4);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("SWORD", swordProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SWORD", {
        "types": {
            "SHARP": 1.0,
        }
    });
    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}

function swordProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", 45.0, 0);
}

function getProfile(entity) {
    return entity.getData("emo:dyn/sword") ? "SWORD" : null;
}

function isKeyBindEnabled(entity, keyBind) {
        switch (keyBind) {
        case "GRAVITY_MANIPULATION":
            return entity.getData("emo:dyn/next");
        case "TELEPORT":
                return entity.getData("emo:dyn/next");
        case "INVISIBILITY":
            return entity.getData("emo:dyn/next");
        case "SPELL_MENU":
            return entity.getData("emo:dyn/next");
            case "AIM":
                return !entity.getData("fiskheroes:gravity_manip");
    
            case "CHARGED_BEAM":
                return !entity.getData("emo:dyn/next") && !entity.getData("fiskheroes:shield") && !entity.getData("emo:dyn/sword") && !entity.getData("fiskheroes:telekinesis") && !entity.getData("emo:dyn/ates")
            case "SHIELD":
                return !entity.getData("emo:dyn/next") && !entity.getData("fiskheroes:beam_charge") && !entity.getData("emo:dyn/sword") && !entity.getData("fiskheroes:telekinesis") && !entity.getData("emo:dyn/ates")
            case "TELEKINESIS":
                return !entity.getData("emo:dyn/next") && !entity.getData("fiskheroes:shield") && !entity.getData("emo:dyn/sword") && !entity.getData("fiskheroes:beam_charge") && !entity.getData("emo:dyn/ates")
            case "SWORD":
                return !entity.getData("emo:dyn/next") && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:beam_charge") && !entity.getData("fiskheroes:telekinesis") && !entity.getData("emo:dyn/ates")
            
            case "NEXT":
                return !entity.getData("fiskheroes:beam_charge") && !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:telekinesis") && !entity.getData("emo:dyn/sword") && !entity.getData("emo:dyn/echo") &&  !entity.getData("emo:dyn/ates") && !entity.getData("emo:dyn/waybig") && !entity.getData("emo:dyn/hayalet")

            default:
                return true;
        }
    
    }    

    function getAttributeProfile(entity) {
        if (entity.getData("emo:dyn/sword")) {
            return "SWORD";
        }
        return true;
    }


function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:gravity_manip");
}
