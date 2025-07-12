function init(hero) {
    hero.setName("Miss Martian/\u00A7c\u00A7lAP 1");
    hero.setVersion("Young Justice");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:miss_martian_powers");
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 1);
    hero.addKeyBind("SHIELD", "Telekinetic Forcefield", 2);
    hero.addKeyBind("CAMOUFLAGE", "Camouflage", 3);
    
    hero.setDefaultScale(0.9);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getAttributeProfile);
}
function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.7, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}