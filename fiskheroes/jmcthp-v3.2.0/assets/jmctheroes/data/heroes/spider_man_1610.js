var jumpMin = 0.5
var jumpMax = 1.6

function init(hero) {
    hero.setName("Ultimate Spider-Man/Peter Parker");
    hero.setAliases("1610");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("fiskheroes:spider_physiology", "jmctheroes:upgraded_web_shooters_1610");
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "Spider-Sense", 4);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:web_swinging_timer") == 1 && entity.getData("jmctheroes:dyn/web_swing") != 1) {
            manager.setData(entity, "jmctheroes:dyn/web_swing", 1)
        }
        if (entity.getData("fiskheroes:web_swinging_timer") == 0 && entity.motionY() < 0.1 && entity.getData("jmctheroes:dyn/web_swing") > 0) {
            manager.setData(entity, "jmctheroes:dyn/web_swing", entity.getData("jmctheroes:dyn/web_swing") - 0.1)
        }
        if ((entity.getData("jmctheroes:dyn/web_swing") > 0 && entity.getData("fiskheroes:web_swinging_timer") == 0 && entity.motionY() < 0.1) && !entity.getData("jmctheroes:dyn/jump")) {
            manager.setData(entity, "jmctheroes:dyn/jump", true)
            manager.setData(entity, "jmctheroes:dyn/choose_jump_animation", Math.floor(Math.random() * 3))
        }
        if ((entity.isOnGround() || entity.getData("fiskheroes:web_swinging_timer") == 1) && entity.getData("jmctheroes:dyn/jump")) {
            manager.setData(entity, "jmctheroes:dyn/jump", false)
        }
        if (entity.getData("jmctheroes:dyn/jump")) {
            manager.setData(entity, "jmctheroes:dyn/jump_timer", entity.getData("jmctheroes:dyn/jump_timer") + 0.1)
        } else if (!entity.getData("jmctheroes:dyn/jump") && entity.getData("jmctheroes:dyn/jump_timer") != 0.0) {
            manager.setData(entity, "jmctheroes:dyn/jump_timer", 0.0)
        }
        if (entity.getData("jmctheroes:dyn/jump_timer") >= 1.0 && entity.getData("fiskheroes:jetpacking") && !entity.getData("jmctheroes:dyn/double_jump")) {
            manager.setData(entity, "jmctheroes:dyn/double_jump", true)
        }
        if (entity.getData("jmctheroes:dyn/jump_timer") >= 1.0) {
            manager.setData(entity, "jmctheroes:dyn/jump_animation", entity.getData("jmctheroes:dyn/jump_animation") + 0.1)
        } else if (entity.getData("jmctheroes:dyn/jump_timer") == 0.0 && entity.getData("jmctheroes:dyn/jump_animation") != 0.0) {
            manager.setData(entity, "jmctheroes:dyn/jump_animation", 0.0)
            manager.setData(entity, "jmctheroes:dyn/double_jump", false)
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

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {    
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:propelled_flight":
        return (entity.getData("jmctheroes:dyn/jump_timer") > jumpMin && entity.getData("jmctheroes:dyn/jump_timer") < (entity.getData("fiskheroes:jetpacking") ? jumpMax + 0.2 : jumpMax - 0.2));
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}
