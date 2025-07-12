function init(hero) {
    hero.setName("Spartan/\u00A7c\u00A7lAP 3\u00A7r");
    hero.setVersion("CW");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true, item => !item.nbt().getBoolean("Dual"));

    hero.addPowers("fiskheroes:bullet_resistance", "fiskheroes:grenades");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.18, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.35, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("UTILITY_BELT", "key.grenades", 2);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
    hero.setHasProperty(hasProperty);
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "GUN_RELOAD":
        return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
    case "UTILITY_BELT":
        return !entity.getHeldItem().isGun();
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
