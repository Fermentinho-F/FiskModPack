function init(hero) {
    hero.setName("Mustard");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true);

    hero.addPowers("mordi:mustard_poison")
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 2);

    hero.setDefaultScale(0.90);

    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
}