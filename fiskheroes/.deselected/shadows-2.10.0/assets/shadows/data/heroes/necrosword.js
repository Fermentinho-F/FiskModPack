function init(hero) {
    hero.setName("Necrosword");
    hero.setTier(8);

    hero.setChestplate("(Marvel)");

    hero.addPowers("shadows:all_black")

    hero.addKeyBind("BLADE", "Sword", 1)

    hero.addKeyBind("SHADOWFORM", "Transform", 2);

    hero.addKeyBind("TENTACLE_JAB", "Tentacle Jab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "Tentacle Grab", 2);
    hero.addKeyBind("TENTACLES", "Back Tentacles", 3);
    hero.addKeyBind("SLOW_MOTION", "Slow Motion", 4);

    hero.addAttribute("FALL_RESISTANCE", 12, 0);
    hero.addAttribute("PUNCH_DAMAGE", 9, 0);
    hero.addAttribute("REACH_DISTANCE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 3, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("STEP_HEIGHT", 1, 0);

    hero.addDamageProfile("sword", {
        "types": {
            "SHARP": 1.0
        }
    });
    hero.addAttributeProfile("nothing", nothing);
    hero.addAttributeProfile("shadow_form", shadow_form);

    hero.setAttributeProfile(getProfile);

    hero.setDamageProfile(getDmgProfile);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setHasProperty(hasProperty);

    hero.setTickHandler((entity, manager) => {
        if ((entity.getData("fiskheroes:shadowform") || entity.getData("fiskheroes:tentacles") != null || !entity.getData("fiskheroes:blade")) && entity.getData("fiskheroes:shield")) {
            manager.setData(entity, "fiskheroes:shield", false);
        }
        if (entity.getData("fiskheroes:blade")) {
            if ((!entity.getData("fiskheroes:shadowform") && entity.getData("fiskheroes:tentacles") == null) && !entity.getData("fiskheroes:shield")) {
                manager.setData(entity, "fiskheroes:shield", true);
            }
        }
    });

}
function nothing(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 0, 0);
    profile.addAttribute("REACH_DISTANCE", 0, 0);
}

function shadow_form(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 1, 1);
    profile.addAttribute("JUMP_HEIGHT", -2, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("STEP_HEIGHT", 2, 0);
}

function getProfile(entity) {
    if (entity.getData("fiskheroes:shadowform")) {
        return "shadow_form";
    } else if (!entity.getData("fiskheroes:blade") || entity.getData("fiskheroes:tentacles") != null) {
        return "nothing";
    }
    return null;
}
function getDmgProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "sword" : null;
}

function isModifierEnabled(entity, modifier) {
    var block = (x, y, z) => {
        return entity.world().getBlock(entity.pos().add(x, y, z)) != "minecraft:air"
    };
    switch (modifier.name()) {
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:shadowform") &&
        (block(0, 1, 1) || block(0, 1, -1) || block(-1, 1, 0) || block(1, 1, 0) || block(0, 0, -1) || block(0, 0, 1) || block(-1, 0, 0) || block(1, 0, 0));
    case "fiskheroes:tentacles":
        return !entity.getData("fiskheroes:shadowform");
    case "fiskheroes:projectile_immunity":
        return entity.getData("fiskheroes:shield_blocking");
    case "fiskheroes:shield":
        return entity.as("DISPLAY").getDisplayType() != "BOOK_PREVIEW";
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHADOWFORM":
        return entity.getData("fiskheroes:tentacles") == null;
    case "BLADE":
        return !entity.getData("fiskheroes:shadowform") && entity.getData("fiskheroes:tentacles") == null;
    case "TENTACLES":
        return !entity.getData("fiskheroes:shadowform");
    case "TENTACLE_JAB":
        return entity.getData("fiskheroes:tentacles") != null;
    case "TENTACLE_GRAB":
        return entity.getData("fiskheroes:tentacles") != null;

    default:
        return true
    }
}

function hasProperty(property) {
    return property == "BREATHE_SPACE";
}
