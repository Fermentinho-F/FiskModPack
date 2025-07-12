function init(hero) {
    hero.setName("Red X/\u00A7c\u00A7lAP 4");
    hero.setVersion("Teen Titans");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("tmhp:red_x_suit");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("TELEPORT", "key.teleport", 2);
    hero.addKeyBind("SHIELD", "X", 3);
    
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});

    hero.setDefaultScale(0.92);
    hero.setHasPermission(hasPermission);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying")) {
            manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
        }
        manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);
    });
}
function hasPermission(entity, permission) {
    return permission == "USE_GRAPPLING_GUN";
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.5, 0);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
    default:
        return true;
    }
}