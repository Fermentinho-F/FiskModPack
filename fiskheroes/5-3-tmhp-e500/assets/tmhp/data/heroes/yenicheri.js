function init(hero) {
    hero.setName("Yenicheri Soldier/\u00A7c\u00A7lAP 4");
    hero.setTier(3);
    
    hero.setHelmet("Fes");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("tmhp:sword_bow");
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("ARROW_DAMAGE", 0.4, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.45, 1);

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
    profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
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