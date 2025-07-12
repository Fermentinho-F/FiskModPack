var speedster_powers = implement("loriatpack:external/speedster_powers");
var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Flash/Barry Allen");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("loriatpack:speed_force");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);

    speedster_powers.init(hero);
    
    hero.setTickHandler((entity, manager) => { 

      speedster_powers.tick(entity, manager);
      speedster_base.tick(entity, manager);

    });

}

