function init(hero) {
    hero.setName("Lois Lane/\u00A7c\u00A7lAP 1\u00A7r");
    hero.setTier(1);

    hero.setDefaultScale(0.95);
    
    hero.setHelmet("item.superhero_armor.piece.hair");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:elt}", true, item => item.nbt().getString('WeaponType') === "sl:elt");
    
    hero.addPowers("sl:plotarmor", "sl:cancer");
    hero.addAttribute("PUNCH_DAMAGE", 1.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.10, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("SHIELD", "Plot Armor", 1);
    hero.addKeyBind("CHARGED_BEAM", "Call Superman", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);

    hero.addSoundEvent("AIM_START", "sl:elt_aim");
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGED_BEAM":
            return (entity.getData("fiskheroes:aimed_timer") == 1 || entity.getData("fiskheroes:beam_charging")) && (entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_charge") == 0);
        case "AIM":
            return entity.getHeldItem().nbt().getString('WeaponType') === "sl:elt";
        default:
            return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().nbt().getString('WeaponType') === "sl:elt";
}
