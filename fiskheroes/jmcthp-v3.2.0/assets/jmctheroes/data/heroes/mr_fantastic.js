function init(hero) {
    hero.setName("Mr. Fantastic");
    hero.setVersion("Fantastic 4");
    hero.setAliases("fantastic");
    hero.setTier(4);

    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:cosmic_ray_enhanced_physiology_mr_fantastic");
    hero.addAttribute("FALL_RESISTANCE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.75, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);

    hero.addKeyBind("SHIELD", "key.shield", 1);
    hero.addKeyBind("BLADE", "Boxing Glove", 1);
    hero.addKeyBind("TENTACLE_JAB", "Punch", 1);
    hero.addKeyBind("TENTACLES", "Extend Arm", 2);
    hero.addKeyBind("SIZE_MANIPULATION", "key.sizeManipulation", 3);

    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("GLOVE", gloveProfile);
}
function gloveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.7, 0);
    profile.addAttribute("KNOCKBACK", 2.5, 0);
}

function getProfile(entity) {
    if (entity.getData("fiskheroes:blade")) {
        return "GLOVE";
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:tentacles"));
    case "fiskheroes:shield":
        return !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:tentacles"));
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getData("fiskheroes:blade_timer") == 0 && !entity.getData("fiskheroes:tentacles") || entity.isBookPlayer() && !entity.getData("fiskheroes:tentacles");
    case "BLADE":
        return entity.getData("fiskheroes:shield_timer") > 0 && !entity.getData("fiskheroes:tentacles") || entity.getData("fiskheroes:blade_timer") > 0 && !entity.getData("fiskheroes:tentacles") || entity.isBookPlayer() && !entity.getData("fiskheroes:tentacles");
    case "TENTACLE_JAB":
        return entity.getData("fiskheroes:tentacles") != null && !entity.getData("fiskheroes:blade");
    case "TENTACLES":
        return !entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:scale") <= 1.01;
    case "SIZE_MANIPULATION":
        return !entity.getData("fiskheroes:tentacles");
    default:
        return true;
    }
}