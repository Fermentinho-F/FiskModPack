var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Miss Martian (Young Justice)");
    hero.setTier(8);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("fiskheroes:martian_physiology", "emo:telekinesis");
    hero.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    
    hero.addKeyBind("SHAPE_SHIFT", "Shape Shift", 1);
    hero.addKeyBind("TELEKINESIS", "Martian telekinesis", 2);
    hero.addKeyBind("INTANGIBILITY", "Intangibility", 3);
    hero.addKeyBind("INVISIBILITY", "Invisibility", 4);
    hero.addKeyBind("SHAPE_SHIFT_RESET", "Shape Shift Reset", 5);
    
    hero.setDefaultScale(0.9);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}
