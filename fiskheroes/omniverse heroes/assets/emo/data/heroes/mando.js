function init(hero) {
    hero.setName("Mandalorian");
    hero.setTier(5);
    
    hero.setHelmet("helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:bo_staff", true);
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("emo:mando");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 12.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("AIM", "Fire Blast", 1);
    hero.addKeyBind("HEAT_VISION", "Hand lazer", 2);
    hero.addKeyBind("UTILITY_BELT", "key.throwingStars", 3);

    hero.setRuleValueModifier(ruleModifier);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
    });
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
    return permission == "USE_GRAPPLING_GUN" || permission == "USE_CHRONOS_RIFLE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
