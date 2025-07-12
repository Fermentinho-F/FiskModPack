function init(hero) {
    hero.setName("omen");
    hero.setTier(6);
    
    hero.setChestplate("suit");
    hero.addPrimaryEquipment("fisktag:shotgun", true);
    
    hero.addPowers("emo:omen");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
	hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 11.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.10, 1);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("INVISIBILITY", "invisibility", 1);
    hero.addKeyBind("TELEPORT", "teleport", 2);
    hero.addKeyBind("SPELL_MENU", "blindness", 3);
    
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
    return permission == "USE_RIPS_GUN" || permission == "USE_CHRONOS_RIFLE";
}

function canAim(entity) {
    return entity.getHeldItem().isLaserGun();
}
