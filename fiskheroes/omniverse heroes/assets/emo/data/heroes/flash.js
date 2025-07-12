var speedster_base = implement("emo:external/speedster_base");

function init(hero) {
    hero.setName("The Flash 90's");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:flash_ring", true);
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("emo:speed_force");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 1.5, 1);

    hero.addKeyBind("SUPER_SPEED", "Super Speed", 1);
    hero.addKeyBind("SLOW_MOTION", "Slow Motion", 2);
    hero.addKeyBind("CHARGE_ENERGY", "Steal Speed Lightning And Lighning Punch", 3);
    hero.addKeyBind("SPELL_MENU", "Clones", 4);
    
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
    hero.addSoundOverrides("BARRY", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_BARRY));
    hero.addSoundOverrides("TEST", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_TEST));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}