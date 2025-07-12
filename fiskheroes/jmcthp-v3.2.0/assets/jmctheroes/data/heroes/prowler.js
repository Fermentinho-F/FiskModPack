function init(hero) {
    hero.setName("Prowler");
    hero.setAliases("prowler", "aaron");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:prowler_suit");
    hero.addAttribute("FALL_RESISTANCE", 14.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.7, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 1.0, 0);

    hero.addKeyBind("SUPER_SPEED", "Toggle Power Enhancements", 1);
    hero.addKeyBind("BLADE", "Toggle Power Enhancements", 1);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addSoundEvent("EQUIP", ["fiskheroes:flicker_loop_zoom", "fiskheroes:flicker_loop_zoom_pink"]);
    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 4, entity.isSprinting() && entity.getData("fiskheroes:speed_sprinting") && entity.getData("fiskheroes:speed") > 0.5);
        if (!entity.getData("fiskheroes:blade")) {
            manager.setData(entity, "fiskheroes:speeding", false);
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.4, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:leaping":
        return entity.getData("fiskheroes:speeding");
    default:
        return true;
    }
}
