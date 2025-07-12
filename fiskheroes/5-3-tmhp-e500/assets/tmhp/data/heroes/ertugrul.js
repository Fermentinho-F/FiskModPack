function init(hero) {
    hero.setName("Ertughrul Pasha/\u00A7c\u00A7lAP 7");
    hero.setTier(5);
    hero.hide();
    
    hero.setHelmet("Fes");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:sword_bow");
    hero.addAttribute("FALL_RESISTANCE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.6, 1);
    hero.addAttribute("ARROW_DAMAGE", 0.8, 1);
    
    hero.addKeyBind("SHIELD", "Grab Sword", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 1);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 30.0, 0);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getHeldItem().isEmpty();
    case "HORIZONTAL_BOW":
        return entity.getHeldItem().name() == "fiskheroes:compound_bow";
    default:
        return true;
    }
}