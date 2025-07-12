var speedster_base = implement("fiskheroes:external/speedster_base");

var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Illumination 2099");
    hero.setTier(9);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("moopack:unstable_molecule_light_suit");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.75, 1);
    hero.addAttribute("MAX_HEALTH", 8.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SUPER_SPEED", "Self Acceleration", 1);
    hero.addKeyBind("SLOW_MOTION", "Enhanced Senses", 2);
    hero.addKeyBind("INVISIBILITY", "Cloaking", 3);
    hero.addKeyBind("PHASE", "Destabilize Suit", 4);
    hero.addKeyBind("OFF", "Stabilize Suit", 4);
    hero.addKeyBind("WEB_ZIP", "Grapple Line", 5);
    hero.addKeyBind("ENERGY_PROJECTION", "Unstable Energy Beam", 3);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 5);

    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    hero.addSoundOverrides("BARRY", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_BARRY));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function hasProperty(entity, property) {
    //return property == "BREATHE_SPACE";
    //return property == "MASK_TOGGLE";

    switch (property) {
        case "MASK_TOGGLE":
            return !entity.getData("moopack:dyn/phase_active");
        case "BREATHE_SPACE":
            return !entity.getData("fiskheroes:mask_open");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "INTANGIBILITY":
            return entity.getData("moopack:dyn/phase_active");
        case "INVISIBILITY":
            return !entity.getData("moopack:dyn/phase_active");
        case "ENERGY_PROJECTION":
            return entity.getData("moopack:dyn/phase_active");
        case "WEB_ZIP":
            return !entity.getData("moopack:dyn/phase_active");
    case "OFF":
        return entity.getData("moopack:dyn/phase_active");
        default:
            return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:intangibility":
            return entity.getData("moopack:dyn/phase_active");
        case "fiskheroes:invisibility":
            return !entity.getData("moopack:dyn/phase_active");
        case "fiskheroes:energy_projection":
            return entity.getData("moopack:dyn/phase_active");
        case "fiskheroes:web_zip":
            return !entity.getData("moopack:dyn/phase_active");
        default:
            return true;
    }
}