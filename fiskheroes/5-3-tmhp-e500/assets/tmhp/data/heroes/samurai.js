function init(hero) {
    hero.setName("Samurai/\u00A7c\u00A7lAP 4");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    hero.addPrimaryEquipment("fiskheroes:katana", true, item => !item.nbt().getBoolean("Dual"));
    
    hero.addPowers("tmhp:sword_bow");
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("ARROW_DAMAGE", 0.15, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.05, 1);

    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 3);

    hero.setKeyBindEnabled(isKeyBindEnabled);
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "HORIZONTAL_BOW":
        return entity.getHeldItem().name() == "fiskheroes:compound_bow";
    default:
        return true;
    }
}