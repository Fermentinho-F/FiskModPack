function init(hero) {
    hero.setName("Deadshot/\u00A7c\u00A7lAP 3");
    hero.setTier(1);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:chronos_rifle", true);
    hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    
    hero.addPowers("fiskheroes:grenades");
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("UTILITY_BELT", "key.grenades", 2);
    
    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
}
function hasPermission(entity, permission) {
    return permission == "USE_GUN" || permission == "USE_CHRONOS_RIFLE";
}

function canAim(entity) {
    return entity.getHeldItem().name() == "fiskheroes:chronos_rifle" || entity.getHeldItem().isGun() || entity.getHeldItem().name() === "fisktag:weapon";
}