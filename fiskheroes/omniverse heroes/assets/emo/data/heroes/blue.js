var speedster_base = implement("emo:external/speedster_base");

function init(hero) {
    hero.setName("Blue Lightning");
    hero.setTier(9);
    
    hero.setChestplate("Mask");
    hero.addPrimaryEquipment("fiskheroes:flash_ring", true);
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("emo:speed_force2");
    hero.addAttribute("PUNCH_DAMAGE", 12.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 4.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 400.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 15.0, 0);
    hero.addAttribute("SPRINT_SPEED", 1.5, 1);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGED_BEAM", "Lightning Blast", 3);
    hero.addKeyBind("TELEPORT", "Speed Force Teleport", 4);
    hero.addKeyBind("SPELL_MENU", "clones", 5);
    
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("MASK_OPEN", ["fiskheroes:reverse_flash_vibration_on", "fiskheroes:reverse_flash_vibration_loop"]);

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}
