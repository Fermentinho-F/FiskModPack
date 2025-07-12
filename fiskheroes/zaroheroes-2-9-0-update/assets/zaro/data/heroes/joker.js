function init(hero) {
    hero.setName("Joker");
    hero.setTier(1);
    

    hero.setHelmet("Mask");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");
    hero.addPrimaryEquipment("fiskheroes:beretta_93r{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
   

    hero.addPowers("zaro:joker_physiology", "fiskheroes:bullet_resistance");
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);

    
    hero.addKeyBind("UTILITY_BELT", "Utility Belt", 1);
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 2);
    hero.addKeyBind("CHARGED_BEAM", "fart", 3);

   
    hero.setHasProperty(hasProperty);


    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
