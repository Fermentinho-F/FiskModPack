var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Zoom Negative Speed Force");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:flash_ring", true);
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("emo:speed_force");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 2.0, 1);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("SPELL_MENU", "clones", 3);
    
    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("EQUIP", "fiskheroes:flicker_loop_zoom");
    hero.addSoundOverrides("Zoom Negative Speed Force", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_ZOOM));
    hero.addSoundOverrides("Zoom Negative Speed Force", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_ZOOM, {
        "powers": {
            "emo:speed_force": {
                "fiskheroes:super_speed": {
                    "ENABLE": ["fiskheroes:zoom_concept_vibration_on", "fiskheroes:zoom_concept_vibration_loop"]
                }
            }
        }
    }));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
}
