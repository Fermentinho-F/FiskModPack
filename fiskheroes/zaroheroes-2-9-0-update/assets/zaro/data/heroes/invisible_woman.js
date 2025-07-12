function init(hero) {
    hero.setName("invisible woman");
    hero.setTier(2);

  
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.legs");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("zaro:invisible_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

   
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 1);
  
    hero.addKeyBind("SHIELD", "key.forcefield", 2);

    
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setHasProperty(hasProperty);

}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}
function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

