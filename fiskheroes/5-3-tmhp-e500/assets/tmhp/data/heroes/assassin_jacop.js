function init(hero) {
    hero.setName("Assassin/\u00A7c\u00A7lAP 3");
    hero.setVersion("Assassin's Creed:Syndicate/Jacop Frye");
    hero.setTier(5);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:chokuto", true);
    
    hero.addPowers("tmhp:hidden_blade", "tmhp:grapling_hook");
    hero.addAttribute("PUNCH_DAMAGE", 2.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("BLADE", "Toggle Hidden Blade", 2);
    hero.addKeyBind("WEB_ZIP", "Grapling Hook", 3);

    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}