function init(hero) {
    hero.setName("Assassin/\u00A7c\u00A7lAP 3");
    hero.setVersion("Assassin's Creed:Unity/Arno Victor Dorion");
    hero.setTier(5);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:chokuto", true);
    
    hero.addPowers("tmhp:phantom_blade");
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("BLADE", "Toggle Hidden Blade", 2);
    hero.addKeyBind("AIM", "Phantom Bow", 3);

    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
