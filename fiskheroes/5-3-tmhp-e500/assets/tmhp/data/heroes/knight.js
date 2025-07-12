function init(hero) {
    hero.setName("Knight/\u00A7c\u00A7lAP 4");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("tmhp:sword_bow");
    hero.addAttribute("JUMP_HEIGHT", -0.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 1.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("SPRINT_SPEED", -0.1, 1);
    hero.addAttribute("ARROW_DAMAGE", 0.3, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.35, 1);

    hero.addKeyBind("SHIELD", "Grab Sword", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 1);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
    hero.setTickHandler((entity, manager) => {
        manager.setData(entity, "fiskheroes:shield", entity.getHeldItem().isEmpty());
    });
    hero.supplyFunction("fisktagScroll", entity => true);
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") && entity.isAlive() ? "SHIELD" : null;
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