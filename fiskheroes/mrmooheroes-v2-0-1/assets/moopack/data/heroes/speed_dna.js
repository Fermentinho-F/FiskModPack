var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Speed DNA");
    hero.setAliases("kf");
    hero.setTier(1);

    hero.setChestplate("Syringe");

    hero.addPowers("moopack:speed_dna");
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SUPER_SPEED", "Self Acceleration", 1);
    hero.addKeyBind("SLOW_MOTION", "Slow Time", 2);

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundOverrides("KF", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_KF));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}
