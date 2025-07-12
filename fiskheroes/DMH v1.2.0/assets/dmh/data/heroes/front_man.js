function init(hero) {
    hero.setName("Front Man/Hwang In-Ho");
    hero.setTier(6);

    hero.setHelmet("Mask");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true);

    hero.addPowers("dmh:front_man", "dmh:front_man2");


    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("KNOCKBACK", 0.05, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.05, 1);

    hero.addKeyBind("AIM", "key.aim", -1);;
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.setKeyBindEnabled(setKeyBindEnabled);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
    hero.setHasProperty(hasProperty);
    hero.setTickHandler((entity, manager) => {
    });
}

function hasPermission(entity, permission) {
    return permission == "USE_GUN";
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function setKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "GUN_RELOAD":
            return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
        default:
            return true;
    }
}