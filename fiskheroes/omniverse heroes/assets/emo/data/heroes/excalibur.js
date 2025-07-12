function init(hero) {
    hero.setName("Excalibur");
    hero.setTier(5);
    
    hero.setChestplate("Sword");
    
    hero.addPowers("emo:excalibur");
    hero.addAttribute("JUMP_HEIGHT", 2.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 9.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("SHIELD", "Excalibur", 1);
    hero.addKeyBind("SUPER_SPEED", "Excalibur Speed", 2);
	hero.addKeyBind("SLOW_MOTION", "Excalibur Slow Time", 3);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 40.0, 0);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "SUPER_SPEED":
            return entity.getData("fiskheroes:shield");
        case "SLOW_MOTION":
            return entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}