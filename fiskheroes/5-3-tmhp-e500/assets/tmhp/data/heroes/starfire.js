function init(hero) {
    hero.setName("Starfire/\u00A7c\u00A7lAP 5");
    hero.setTier(7);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:princess_of_tamaran");
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    
    hero.addKeyBind("ENERGY_PROJECTION", "Energy Projection", 1);
    hero.addKeyBind("CHARGED_BEAM", "Charged Eye Beam", 2);
    
    hero.setDefaultScale(0.89);
    hero.setHasProperty(hasProperty);
}
function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}
