function init(hero) {
    hero.setName("Ender/\u00A7c\u00A7lAP 3");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    
    hero.addPowers("tmhp:ender");
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("HEAT_VISION", "key.heatVision", 2);
    hero.addKeyBind("SHIELD", "key.shield", 3);
    hero.addKeyBind("TELEPORT", "key.teleport", 4);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 5);
    
    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
}
