var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Iron Spider");
    hero.setTier(9);
    
    hero.setChestplate("Suit");
       
    hero.addPowers("emo:spider", "fiskheroes:vibranium_physiology", "fiskheroes:web_shooters", "emo:mechanical_smart_arms");
    hero.addAttribute("FALL_RESISTANCE", 1200.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 9.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("CHARGED_BEAM", "key.repulsorBeams", 1);
    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("TENTACLES", "key.tentacles", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "Transform", 5);
	
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    
    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.getData("fiskheroes:beam_charging") && !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:blade_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);
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

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("fiskheroes:dyn/nanites");
            case "fiskheroes:web_swinging":
                return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
            case "fiskheroes:leaping":
                return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
        default:
            return true;
        }
    }


    function isKeyBindEnabled(entity, keyBind) {
        if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
            return keyBind != "NANITE_TRANSFORM";
        }
        
        switch (keyBind) {
            case "CHARGED_BEAM":
                 return entity.getData("fiskheroes:dyn/nanites");
                 case "UTILITY_BELT":
                    return entity.getData("fiskheroes:dyn/nanites");
                    case "func_WEB_SWINGING":
                        return entity.getData("fiskheroes:dyn/nanites");
                        case "WEB_ZIP":
                            return entity.getData("fiskheroes:dyn/nanites");
            case "AIM":
                 return entity.getData("fiskheroes:dyn/nanites");
                 case "TENTACLES":
                 return entity.getData("fiskheroes:dyn/nanites");
                 case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
            default:
                return true;
        }
    }
    

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

