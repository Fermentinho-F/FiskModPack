function init(hero) {
    hero.setName("Clone Trooper");
    hero.setVersion("\u00A7b\u00A7lPHASE I\u00A7r");
    hero.setAliases("Republic_Troopers", "Republic_Troops", "Republic_Soldiers", "Regs", "Boys in White");
    hero.setTier(5);
    
    hero.setHelmet("Helmet");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:dc17_single", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:dc17_single");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:dc15a", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:dc15a");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:dc15s", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:dc15s");
    
    hero.addPowers("swhp:clone_trooper_armor_phase1");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("KNOCKBACK", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.1, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.15, 1);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("UTILITY_BELT", "Gadgets", 5);
    
    hero.setDefaultScale(1.0);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);

    hero.addSoundEvent("MASK_OPEN", "swhp:voicelines_clonetrooper");
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function canAim(entity) {
    return (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc17_single") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc15a") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc15s") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc17m") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:rps6") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:z6");
}

function hasPermission(entity, permission) {
    return (permission == "USE_DC17SINGLE") || (permission == "USE_DC15A") || (permission == "USE_DC15S") || (permission == "USE_DC17M") || (permission == "USE_RPS6") || (permission == "USE_Z6");
}