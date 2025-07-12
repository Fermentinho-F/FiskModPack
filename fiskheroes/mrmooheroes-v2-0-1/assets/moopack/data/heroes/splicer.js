function init(hero) {
    hero.setName("Splicer");
    hero.setTier(1);

    hero.setChestplate("Wristwatch");

    hero.addPowers("moopack:spider_dna_sw");
    hero.addPowers("moopack:symbiote_dna_sw");
    hero.addPowers("moopack:mutant_dna_sw");
    hero.addPowers("moopack:cosmic_dna_sw");
    hero.addPowers("moopack:speed_dna_sw");
    hero.addPowers("moopack:nature_dna_sw");
    hero.addPowers("moopack:dna_cycler_sw");

    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SPIDER_DNA", "Activate Spider DNA", 4);
    //hero.addKeyBind("OFF", "Deactivate Spider DNA", 4);

    hero.addKeyBind("MUTANT_DNA", "Activate Mutant DNA", 3);
    //hero.addKeyBind("MUTANT_DNA_OFF", "Deactivate Mutant DNA", 3);

    hero.addKeyBind("SYMBIOTE_DNA", "Activate Symbiote DNA", 5);
    //hero.addKeyBind("SYMBIOTE_DNA_OFF", "Deactivate Symbiote DNA", 5);

    hero.addKeyBind("SPEED_DNA", "Activate Speed DNA", 3);
    //hero.addKeyBind("SPEED_DNA_OFF", "Deactivate Speed DNA", 3);

    hero.addKeyBind("NATURE_DNA", "Activate Nature DNA", 2);
    //hero.addKeyBind("NATURE_DNA_OFF", "Deactivate Nature DNA", 2);

    hero.addKeyBind("COSMIC_DNA", "Activate Cosmic DNA", 4);
    //hero.addKeyBind("COSMIC_DNA_OFF", "Deactivate Cosmic DNA", 4);

    hero.addKeyBind("CYCLE", "Cycle DNA", 1);

    hero.addKeyBind("UTILITY_BELT", "key.webShooters", 1);
    hero.addKeyBind("WEB_ZIP", "key.webZip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "key.webSwinging", 3);

    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
    hero.addKeyBind("TENTACLES", "key.tentacles", 3);

    hero.addKeyBind("TELEPORT", "Teleport", 1);
    hero.addKeyBind("SHADOWFORM", "Shadow Form", 2);

    hero.addKeyBind("SUPER_SPEED", "Self Acceleration", 1);
    hero.addKeyBind("SLOW_MOTION", "Slow Time", 2);

    hero.addKeyBind("GRAVITY_MANIPULATION", "Gravity Manipulation", 1);

    hero.addKeyBind("CHARGED_BEAM", "Cosmic Beam", 1);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 2);
    hero.addKeyBind("SHIELD", "Forcefield", 3);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
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

    case "fiskheroes:flight":
        return entity.getData("fiskheroes:shadowform");

    case "fiskheroes:tentacles":
        return entity.getData("moopack:dyn/symbiote_dna_active");

    case "fiskheroes:super_speed":
        return entity.getData("moopack:dyn/speed_dna_active");
    case "fiskheroes:slow_motion":
        return entity.getData("moopack:dyn/speed_dna_active");
    
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {

    case "CYCLE":
        return !entity.getData("moopack:dyn/symbiote_dna_active") && !entity.getData("moopack:dyn/spider_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active") && !entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/nature_dna_active");

    case "MUTANT_DNA":
        return !entity.getData("moopack:dyn/symbiote_dna_active") && !entity.getData("moopack:dyn/spider_dna_active") && !entity.getData("moopack:dyn/cycle_active");
    //case "MUTANT_DNA_OFF":
    //    return entity.getData("moopack:dyn/mutant_dna_active");
    case "SYMBIOTE_DNA":
        return !entity.getData("moopack:dyn/mutant_dna_active") && !entity.getData("moopack:dyn/spider_dna_active") && !entity.getData("moopack:dyn/cycle_active");
    //case "SYMBIOTE_DNA_OFF":
    //    return entity.getData("moopack:dyn/symbiote_dna_active");
    case "SPIDER_DNA":
        return !entity.getData("moopack:dyn/symbiote_dna_active") && !entity.getData("moopack:dyn/mutant_dna_active") && !entity.getData("moopack:dyn/cycle_active");
    //case "SPIDER_DNA_OFF":
    //    return entity.getData("moopack:dyn/spider_dna_active");

    case "SPEED_DNA":
        return entity.getData("moopack:dyn/cycle_active") && !entity.getData("moopack:dyn/nature_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active");
    case "COSMIC_DNA":
        return entity.getData("moopack:dyn/cycle_active") && !entity.getData("moopack:dyn/nature_dna_active") && !entity.getData("moopack:dyn/speed_dna_active");
    case "NATURE_DNA":
        return entity.getData("moopack:dyn/cycle_active") && !entity.getData("moopack:dyn/speed_dna_active") && !entity.getData("moopack:dyn/cosmic_dna_active");

    case "UTILITY_BELT":
        return entity.getData("moopack:dyn/spider_dna_active") && entity.getData('fiskheroes:tentacles') == null;
    case "WEB_ZIP":
        return entity.getData("moopack:dyn/spider_dna_active") && entity.getData('fiskheroes:tentacles') == null;
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty() && entity.getData("moopack:dyn/spider_dna_active") && entity.getData('fiskheroes:tentacles') == null;

    case "TENTACLES":
        return entity.getData("moopack:dyn/symbiote_dna_active");
    case "TENTACLE_JAB":
        return entity.getData("moopack:dyn/symbiote_dna_active") && entity.getData('fiskheroes:tentacles') != null;
    case "TENTACLE_GRAB":
        return entity.getData("moopack:dyn/symbiote_dna_active") && entity.getData('fiskheroes:tentacles') != null;

    case "TELEPORT":
        return entity.getData("moopack:dyn/mutant_dna_active") && entity.getData('fiskheroes:tentacles') == null;
    case "SHADOWFORM":
        return entity.getData("moopack:dyn/mutant_dna_active") && entity.getData('fiskheroes:tentacles') == null;

    case "SUPER_SPEED":
        return entity.getData("moopack:dyn/speed_dna_active") && entity.getData('fiskheroes:tentacles') == null && entity.getData("moopack:dyn/cycle_active");
    case "SLOW_MOTION":
        return entity.getData("moopack:dyn/speed_dna_active") && entity.getData('fiskheroes:tentacles') == null && entity.getData("moopack:dyn/cycle_active");

    case "GRAVITY_MANIPULATION":
        return entity.getData("moopack:dyn/nature_dna_active") && entity.getData('fiskheroes:tentacles') == null && entity.getData("moopack:dyn/cycle_active");

    case "CHARGED_BEAM":
        return entity.getData("moopack:dyn/cosmic_dna_active") && entity.getData('fiskheroes:tentacles') == null && entity.getData("moopack:dyn/cycle_active");
    case "TELEKINESIS":
        return entity.getData("moopack:dyn/cosmic_dna_active") && entity.getData('fiskheroes:tentacles') == null && entity.getData("moopack:dyn/cycle_active");
    case "SHIELD":
        return entity.getData("moopack:dyn/cosmic_dna_active") && entity.getData('fiskheroes:tentacles') == null && entity.getData("moopack:dyn/cycle_active");

    default:
        return true;
    }
}
