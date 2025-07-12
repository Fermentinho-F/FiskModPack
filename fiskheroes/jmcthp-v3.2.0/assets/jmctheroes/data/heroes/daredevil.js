function init(hero) {
    hero.setName("Daredevil");
    hero.setAliases("matt");
    hero.setTier(5);
    
    hero.setHelmet("Cowl");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("jmctheroes:enhanced_senses", "jmctheroes:billy_clubs");
    hero.addAttribute("PUNCH_DAMAGE", 6.2, 0);
    hero.addAttribute("WEAPON_DAMAGE", -0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);

    hero.addKeyBind("BLADE", "Toggle Billy Clubs", 1);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "Toggle Billy Clubs", 1);
    hero.addKeyBind("WEB_ZIP", "Billy Club Zip", 2);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setAttributeProfile(getProfile);
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

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.6, 0);
    profile.addAttribute("WEAPON_DAMAGE", -0.5, 1);
    profile.addAttribute("SPRINT_SPEED", 0.3, 1);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:web_zip":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:blade");    
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "BLADE":
        return entity.getHeldItem().isEmpty();
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    case "WEB_ZIP":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:blade");
    default:
        return true;
    }
}