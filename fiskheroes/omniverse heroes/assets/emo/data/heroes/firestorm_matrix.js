var firestorm = implement("emo:external/firestorm_base");

function init(hero) {
    hero.setName("firestorm matrix");
    hero.setTier(5);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    
    hero.addPowers("fiskheroes:firestorm_matrix");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 5000.5, 0);
    
    firestorm.init(hero);
}
