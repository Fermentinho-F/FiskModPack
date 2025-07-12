function init(hero) {
    hero.setName("Revenant Spider");
    hero.setTier(7);

    hero.setHelmet("Mask");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("fiskheroes:spider_physiology", "fiskheroes:web_shooters", "fiskheroes:web_wings", "dmh:darkness_manip");
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 9.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("STEP_HEIGHT", 1.0, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.62, 1);

    hero.addKeyBind("UTILITY_BELT", "\u00A78\u00A7lWeb Shooters", 2);

    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "\u00A78\u00A7lToggle Web Swinging", 3);
    hero.addKeyBindFunc("func_WEB_SWINGING_VISUAL", webSwingingKey, "\u00A78\u00A7l\u00A7mToggle Web Swinging", 3);

    hero.addKeyBindFunc("func_WEB_WINGS", webWingsKey, "\u00A78\u00A7lWeb Wings", 5);

    hero.addKeyBind("CHARGED_BEAM", "\u00A70\u00A7lDarkness Blast", 1);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "\u00A70\u00A7l\u00A7mDarkness Blast", 1);

    hero.addKeyBind("TELEKINESIS", "\u00A70\u00A7lUmbral Grasp", 4);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A70\u00A7l\u00A7mUmbral Grasp", 4);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

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
    }

    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:web_swinging":
            return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:gliding");
        case "fiskheroes:leaping":
            return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
        case "fiskheroes:gliding":
            return !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem();
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "func_WEB_SWINGING":
            return entity.getHeldItem().isEmpty();
        case "func_WEB_SWINGING_VISUAL":
            return !entity.getHeldItem().isEmpty();
        case "func_WEB_WINGS":
            return !entity.isOnGround() && !entity.isInWater() && !entity.as("PLAYER").isUsingItem();
        case "TELEKINESIS":
            return !entity.getData("fiskheroes:beam_charging");
        case "TELEKINESIS_VISUAL":
            return entity.getData("fiskheroes:beam_charging");
        case "CHARGED_BEAM":
            return !entity.getData("fiskheroes:grab_id") > -1 && entity.getHeldItem().isEmpty();
        case "CHARGED_BEAM_VISUAL":
            return entity.getData("fiskheroes:grab_id") > -1 || !entity.getHeldItem().isEmpty();
        default:
            return true;
    }
}
