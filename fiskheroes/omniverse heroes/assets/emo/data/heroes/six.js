function init(hero) {
    hero.setName("Agend Six");
    hero.setTier(3);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("fiskheroes:retractable_shield");
    hero.addAttribute("JUMP_HEIGHT", 2.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 19.5, 0);

    hero.addKeyBind("SHIELD", "Swords", 1);

    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 4.1, 0);
    profile.addAttribute("SPRINT_SPEED", 1.1, 1);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}
