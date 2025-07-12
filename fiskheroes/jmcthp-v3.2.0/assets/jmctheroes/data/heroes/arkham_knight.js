function init(hero) {
    hero.setName("Arkham Knight");
    hero.setAliases("arkk");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:chronos_rifle", true);
    hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);

    hero.addPowers("jmctheroes:arkhamsuit");
    hero.addAttribute("PUNCH_DAMAGE", 6.7, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.75, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.25, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 2);

    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
}
function canAim(entity) {
    return entity.getHeldItem().name() == "fiskheroes:chronos_rifle" || entity.getHeldItem().name() == "fiskheroes:desert_eagle";
}

function hasPermission(entity, permission) {
    return permission == "USE_GRAPPLING_GUN" || permission == "USE_CHRONOS_RIFLE" || permission == "USE_GUN";
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return true;
    default:
        return false;
    }
}