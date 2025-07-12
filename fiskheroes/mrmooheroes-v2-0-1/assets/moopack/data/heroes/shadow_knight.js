var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Shadow Knight");
    hero.setTier(7);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("moopack:shadow_helm");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SHADOWFORM", "Shadow Form", 2);
    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 2);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 3);
    hero.addKeyBind("TENTACLES", "Toggle Shadow Hands", 4);
    hero.addKeyBind("HELMET", "Awaken The Helm", 5);
    hero.addKeyBind("OFF", "Quiet The Helm", 5);

    //hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
//    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("SUPER_SPEED", ["fiskheroes:reverse_flash_vibration_on", "fiskheroes:reverse_flash_vibration_loop"]);
    hero.addSoundOverrides("NEGATIVE", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_NEGATIVE));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SUPER_SPEED":
        return entity.getData("moopack:dyn/helmet_active");
    case "OFF":
        return entity.getData("moopack:dyn/helmet_active");
    case "SHADOWFORM":
        return !entity.getData("fiskheroes:tentacles");
    case "TENTACLE_GRAB":
    return keyBind == "TENTACLES" || entity.getData("fiskheroes:tentacles") != null;
    return keyBind == "TENTACLES" || entity.getData("fiskheroes:tentacles") != null;
        default:
            return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:super_speed":
        return entity.getData("moopack:dyn/helmet_active");
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:shadowform");
    case "fiskheroes:tentacles":
        return !entity.getData("fiskheroes:shadowform");
    case "fiskheroes:shadowform":
        return !entity.getData("fiskheroes:tentacles");
    default:
        return true;
    }
}