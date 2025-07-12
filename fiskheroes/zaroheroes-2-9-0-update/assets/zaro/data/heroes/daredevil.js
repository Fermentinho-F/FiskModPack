function init(hero) {
    hero.setName("Daredevil");
    hero.setTier(5);

    hero.setHelmet("helmet");
    hero.setChestplate("chesplate");
    hero.setLeggings("leggings");
    hero.setBoots("boots");

   

     hero.addPowers("zaro:daredevil_physiology");
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);

    hero.addKeyBind("UTILITY_BELT", "Utility Belt", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 4);
   
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");


    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function webWingsKey(player, manager) {
    if (player.isOnGround() || player.isInWater()) {
        return false;
    }


    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:web_swinging", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    case "WEB_ZIP":
        return !entity.getData("fiskheroes:gliding");
    default:
        return true;
    }
}
