var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Conner Stark");
    hero.setTier(9);
    
    hero.setChestplate("Suit");
       
    hero.addPowers("emo:kr_stark", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 5.6, 1);
    hero.addAttribute("JUMP_HEIGHT", 7.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 4.0, 0);
    
    hero.addKeyBind("HEAT_VISION", "freeze breath", 1);
    hero.addKeyBind("AIM", "key.shoot", 2);
    hero.addKeyBind("CHARGED_BEAM", "key.repulsorBeams", 3);
    hero.addKeyBind("EARTHQUAKE", "Earth Quake", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "Iron Man Armor", 5);
	
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

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("fiskheroes:dyn/nanites");
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
            case "AIM":
                 return entity.getData("fiskheroes:dyn/nanites");
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

