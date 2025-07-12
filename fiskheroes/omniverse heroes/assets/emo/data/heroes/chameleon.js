function init(hero) {
    hero.setName("Chameleon (Smallville)");
    hero.setTier(3);
    
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true);
    
    hero.addPowers("emo:invisible");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
	hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("INVISIBILITY", "Invisibility", 2);
    hero.addKeyBind("SLOW_MOTION", "slow vision", 3);
    
    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
}
