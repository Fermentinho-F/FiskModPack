function init(hero) {
    hero.setName("Killer Moth");
    hero.setVersion("item.superhero_armor.version.comics");
    hero.setAliases("moth");
    hero.setTier(3);
    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("jmctheroes:mothsuit");
    hero.addAttribute("PUNCH_DAMAGE", 5.2, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.2, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);

    hero.setRuleValueModifier(rulez);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
}

function rulez(entity, rule) {
    switch (rule.name()) {
    case "fiskheroes:dmgmult_beretta93r":
        return 0.95;
    case "fiskheroes:recoil_deserteagle":
        return 0.35;
    case "fiskheroes:spread_deserteagle":
        return 0.8;
    default:
        return rule.value();
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "GUN_RELOAD":
        return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isGun();
}
