function init(hero) {
    hero.setName("Vandal Savage");
    hero.setTier(6);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:scimitar", true);


    hero.addPowers("emo:savage", "fiskheroes:healing_factor");
    hero.addAttribute("JUMP_HEIGHT", 2.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 9.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0);

    hero.addKeyBind("CHARGED_BEAM", "Energy Blast", 1);
    hero.addKeyBind("UTILITY_BELT", "throwing_star", 2);
    hero.addKeyBind("SHIELD", "Wand", 3);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGED_BEAM":
            return entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}