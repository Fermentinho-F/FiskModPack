function init(hero) {
    hero.setName("Captoin Unipool");
    hero.setTier(9);

    hero.setChestplate("Suit");
    hero.addPrimaryEquipment("fiskheroes:katana{Dual:1}", true, item => item.nbt().getBoolean("Dual"));

    hero.addPowers("fiskheroes:healing_factor", "emo:cosmic2");
    hero.addAttribute("PUNCH_DAMAGE", 17.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 5.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("CHARGED_BEAM", "Cosmic Energy Blast", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Cosmic Beam", 2);
    hero.addKeyBind("AIM", "Mini Energy Blast", 3);
    hero.addKeyBind("SHIELD", "Energy Shield", 4);
    hero.addKeyBind("TELEPORT", "Teleport", 5);
    

    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", canAim);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}