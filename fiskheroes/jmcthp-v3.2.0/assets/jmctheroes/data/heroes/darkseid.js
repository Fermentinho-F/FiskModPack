var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Darkseid");
    hero.setAliases("omega");
    hero.setTier(10);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("Legs");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:new_gods_physiology", "jmctheroes:omega");
    hero.addAttribute("PUNCH_DAMAGE", 13.1, 0);
    hero.addAttribute("BASE_SPEED", -0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBind("CHARGED_BEAM", "Shoot Omega Beams", 1);

    hero.setDefaultScale(1.4);
    hero.setHasProperty(hasProperty);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:beam_charging") && entity.getData("jmctheroes:dyn/random_charge") == 0) {
            manager.setData(entity, "jmctheroes:dyn/random_charge", Math.ceil(Math.random() * 3))
        }
        if (!entity.getData("fiskheroes:beam_charging") && entity.getData("jmctheroes:dyn/random_charge") != 0) {
            manager.setData(entity, "jmctheroes:dyn/random_charge", 0)
        }
    });
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}