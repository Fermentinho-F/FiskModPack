function init(hero) {
    hero.setName("Deadpool");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:katana{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:zaro:railgun}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:zaro:rocket_launcher}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:zaro:shotgun}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:zaro:sniper}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:zaro:rifle}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:zaro:automatic}", true);


  hero.addPowers("fiskheroes:healing_factor");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.5, 0);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);

    hero.setDefaultScale(1.0);
    hero.supplyFunction("canAim", canAim);
      hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);
}

function canAim(entity) {
    return (entity.getHeldItem().nbt().getString("WeaponType") == "zaro:railgun")
    || (entity.getHeldItem().nbt().getString("WeaponType") == "zaro:rocket_launcher") 
    || (entity.getHeldItem().nbt().getString("WeaponType") == "zaro:automatic") 
    || (entity.getHeldItem().nbt().getString("WeaponType") == "zaro:rifle") 
    ||  (entity.getHeldItem().nbt().getString("WeaponType") == "zaro:shotgun") 
    || (entity.getHeldItem().nbt().getString("WeaponType") == "zaro:sniper");
}

function hasPermission(entity, permission) {
    return permission == "USE_FISKTAG_GUN" || permission == "USE_GUN";
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
function canAim(entity) {
    return entity.getHeldItem().isLaserGun() || entity.getHeldItem().isGun();
}


function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "GUN_RELOAD":
            return  entity.getHeldItem().isGun();
        default:
            return true;
        }
}

