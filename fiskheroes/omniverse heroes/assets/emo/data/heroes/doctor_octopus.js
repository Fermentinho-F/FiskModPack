function init(hero) {
    hero.setName("Anti Venom");
    hero.setTier(9);

    hero.setChestplate("Symbiote");

    hero.addPowers("emo:anti");
    hero.addAttribute("FALL_RESISTANCE", 20.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);

    hero.addKeyBind("UTILITY_BELT", "Webs", 1);
    hero.addKeyBind("WEB_ZIP", "Web Zip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("TENTACLE_JAB", "Arm Jab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "Arm Grab", 2);
    hero.addKeyBind("TENTACLES", "Arms", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "Change Form", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setDefaultScale(defaultScale);
    hero.setTierOverride(getTierOverride);

    hero.addAttributeProfile("NANITE_TRANSFORM", symbioteProfile);
    hero.addAttributeProfile("SWORD", swordProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SWORD", {
        "properties": {
            "EFFECTS": [{
                    "id": "minecraft:poison",
                    "duration": 100,
                    "amplifier": 3
                }
            ]
        }
    });
    hero.setTickHandler((entity, manager) => {
        if (entity.getHealth() < 3) 
        {
          manager.setData(entity, "fiskheroes:dyn/nanites", true);
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

function getTierOverride(entity) {
    if (entity.getData("fiskheroes:dyn/nanites")) {
        return 10;
    }
   
    return 2;
}


function symbioteProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 15, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("MAX_HEALTH", 22.0, 0);
    profile.addAttribute("KNOCKBACK", 6.5, 0);
}

function swordProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 100000, 1);
    profile.addAttribute("PUNCH_DAMAGE", 25.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:dyn/nanites") ? "NANITE_TRANSFORM" : entity.getData("emo:dyn/sword") ? "SWORD" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:leaping":
            return entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:arrow_catching":
            return entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:equipment":
            return entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:tentacles":
            return entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:web_swinging":
            return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
       
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (keyBind.startsWith("TENTACLE_") && entity.getData("fiskheroes:tentacles") == null) {
		return false;
	}
    switch (keyBind) {
        case "WEB_ZIP":
            return entity.getData("fiskheroes:dyn/nanites") && entity.getData("fiskheroes:tentacles") == null;
        case "UTILITY_BELT":
            return entity.getData("fiskheroes:dyn/nanites") && entity.getData("fiskheroes:tentacles") == null;
        case "SWORD":
            return entity.getData("fiskheroes:dyn/nanites");
        case "TENTACLES":
            return entity.getData("fiskheroes:dyn/nanites");
        case "func_WEB_SWINGING":
            return entity.getData("fiskheroes:dyn/nanites");
        
            default:
            return true;
    }

}

function defaultScale(entity) {
    if (entity.getData("fiskheroes:dyn/nanites")) {
        return 1.5;
    }
    return 1.0;
}