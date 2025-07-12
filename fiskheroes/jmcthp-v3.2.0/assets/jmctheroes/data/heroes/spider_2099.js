//JMCT's Favourite Suit Ü

function init(hero) {
    hero.setName("Spider-Man 2099");
    hero.setAliases("2099");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:spider_dna", "jmctheroes:spidersuit_2099");
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.9, 0);
    hero.addAttribute("SPRINT_SPEED", 0.65, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);
    hero.addKeyBind("BLADE", "Toggle Claws", 4);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:gliding", false);
    }
    
    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function webWingsKey(player, manager) {
    if (player.isOnGround() || player.isInWater()) {
        return false;
    }
    
    var flag = player.getData("fiskheroes:gliding");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:web_swinging", false);
        manager.setDataWithNotify(player, "fiskheroes:blade", false);
    }
    
    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:gliding");
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:blade":
        return entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:web_swinging");
    case "fiskheroes:gliding":
        return entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:gliding");
    case "BLADE":
        return entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:web_swinging");
    default:
        return true;
    }
}
