function init(hero) {
    hero.setName("Red Hood");
    hero.setVersion("Outlaws");
    hero.setAliases("jason");
    hero.setTier(6);
    hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:1}", true, item => item.nbt().getBoolean("Dual"));

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("jmctheroes:hoodsuit");
	hero.addAttribute("PUNCH_DAMAGE", 5.7, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.7, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

	hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
	hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);

    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "GUN_RELOAD": 
            return entity.getHeldItem().isGun();
        case "UTILITY_BELT": 
            return !entity.getHeldItem().isGun();
        default:
            return true;
	}
}

function hasPermission(entity, permission) {
    return permission == "USE_GRAPPLING_GUN" || permission == "USE_GUN";
}

function canAim(entity) {
    return entity.getHeldItem().isGun();
}
function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}