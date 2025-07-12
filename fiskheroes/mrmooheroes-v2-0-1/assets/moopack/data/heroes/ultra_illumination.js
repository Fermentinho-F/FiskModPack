var speedster_base = implement("fiskheroes:external/speedster_base");

var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Ultra Illumination/Oscar Purchase");
    hero.setTier(10);

    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("moopack:ultra_light_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 13.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("MAX_HEALTH", 10.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Light Beam", 1);
    hero.addKeyBind("INVISIBILITY", "Invisibility", 2);
    hero.addKeyBind("SUPER_SPEED", "Light Speed", 3);
    hero.addKeyBind("TELEPORT", "Ultra Light Speed", 4);

    hero.setHasProperty(hasProperty);

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));


    hero.addSoundOverrides("BARRY", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_BARRY));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}
