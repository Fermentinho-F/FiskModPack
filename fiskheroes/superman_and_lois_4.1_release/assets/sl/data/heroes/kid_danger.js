var speed_punch = implement("sl:external/speed_punch");

function init(hero) {
    hero.setName("Kid Danger/\u00A7c\u00A7lAP 2\u00A7r");
    hero.setTier(3);
    hero.setDefaultScale(0.99);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("Vest");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:zapper}", true, item => item.nbt().getString('WeaponType') === "sl:zapper");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:gum}", true, item => item.nbt().getString('WeaponType') === "sl:gum");

    hero.addPowers("sl:hyper_motility", "sl:bbgum");
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.12, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 1);
    hero.addKeyBind("BBGUM_TRANSFORM", "Transform", 2);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasPermission((entity, permission) => permission === "USE_ZAPPER");

   var speedPunch = speed_punch.createSpeedPunch(hero);
   hero.setDamageProfile(function(entity) {
     return speedPunch.get(entity, null);
   });

}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "BBGUM_TRANSFORM":
        return entity.getHeldItem().nbt().getString('WeaponType') === "sl:gum";
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().nbt().getString('WeaponType') === "sl:zapper";
}
