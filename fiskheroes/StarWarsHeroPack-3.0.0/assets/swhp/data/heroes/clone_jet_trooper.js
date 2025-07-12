var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Clone Jet Trooper");
    hero.setAliases("Republic_Troopers", "Republic_Troops", "Republic_Soldiers", "Regs", "Boys in White");
    hero.setTier(6);
    
    hero.setHelmet("Helmet");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:dc17_single", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:dc17_single");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:dc15a", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:dc15a");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:dc15s", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:dc15s");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:rps6", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:rps6");
    
    hero.addPowers("swhp:clone_jet_trooper_armor","swhp:clone_jet_trooper_jetpack");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("KNOCKBACK", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.15, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.2, 1);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("UTILITY_BELT", "Gadgets", 5);
    
    hero.setDefaultScale(1.0);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);

    hero.addSoundEvent("MASK_OPEN", "swhp:voicelines_clonetrooper");

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);
    });
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}

function canAim(entity) {
    return (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc17_single") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc15a") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc15s") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:dc17m") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:rps6") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:z6");
}

function hasPermission(entity, permission) {
    return (permission == "USE_DC17SINGLE") || (permission == "USE_DC15A") || (permission == "USE_DC15S") || (permission == "USE_DC17M") || (permission == "USE_RPS6") || (permission == "USE_Z6");
}