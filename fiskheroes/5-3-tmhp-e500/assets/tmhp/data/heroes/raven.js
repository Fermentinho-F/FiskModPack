function init(hero) {
    hero.setName("Raven/\u00A7c\u00A7lAP 5");
    hero.setVersion("Teen Titans");
    hero.setTier(8);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("tmhp:raven", "tmhp:speed_force");
    hero.addAttribute("FALL_RESISTANCE", 0.6, 1);
    hero.addAttribute("PUNCH_DAMAGE", -1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 4);
    //hero.addKeyBind("ENERGY_PROJECTION", "Magical Beam", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGED_BEAM", "Dark Magic Beam", 3);
    hero.addKeyBind("TELEPORT", "key.teleport", 1);
    //hero.addKeyBind("SHIELD", "key.forcefield", 5);

    hero.setDefaultScale(0.89);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("STOP", stopProfile);
    hero.setAttributeProfile(getProfile);
}
function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
function stopProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("SPRINT_SPEED", 0.01, 1);
    profile.addAttribute("BASE_SPEED", -0.9, 1);
}
function getProfile(entity) {
    if (entity.getData("fiskheroes:beam_charge")) {
        return "STOP";
    }
}