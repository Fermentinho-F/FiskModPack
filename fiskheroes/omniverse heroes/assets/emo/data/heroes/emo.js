function init(hero) {
    hero.setName("Mr. Emoflix (the creator of this pack)");
    hero.setTier(3);
    
    hero.setChestplate("Suit");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    hero.addPrimaryEquipment("fiskheroes:chronos_rifle", true);
    hero.addPrimaryEquipment("fiskheroes:rip_hunters_gun", true);
    
    hero.addPowers("fiskheroes:bullet_resistance", "emo:gun");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 300.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.20, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("UTILITY_BELT", "throwing star", 1);
    
    hero.setRuleValueModifier(ruleModifier);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
}


function ruleModifier(entity, rule) {
    switch (rule.name()) {
    case "fiskheroes:dmgmult_laserbolt":
        return 20 / 0.25 / 9 / 1.55;
    default:
        return null;
    }
}

function hasPermission(entity, permission) {
    return permission == "USE_RIPS_GUN" || permission == "USE_CHRONOS_RIFLE" || permission == "USE_GRAPPLING_GUN";
}

function canAim(entity) {
    return entity.getHeldItem().isLaserGun();
}
