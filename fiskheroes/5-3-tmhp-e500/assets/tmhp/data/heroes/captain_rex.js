function init(hero) {
    hero.setName("Captain Rex/\u00A7c\u00A7lAP 3");
    hero.setTier(1);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:tmhp:blaster}", true);
    
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
}
function hasPermission(entity, permission) {
    return permission == "USE_GUN";
}

function canAim(entity) {
    return entity.getHeldItem().name() === "fisktag:weapon";
}