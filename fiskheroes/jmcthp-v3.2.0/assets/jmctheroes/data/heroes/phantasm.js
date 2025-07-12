function init(hero) {
    hero.setName("Phantasm");
    hero.setVersion("BTAS");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:phantasmsuit");
    hero.addAttribute("PUNCH_DAMAGE", 5.7, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.7, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("BLADE", "Toggle Blade", 2);
    
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setTickHandler((entity, manager) => {
        if (!entity.getHeldItem().isEmpty()) {
            manager.setData(entity, "jmctheroes:dyn/equip", false);
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "BLADE":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.2, 0);
}

function getProfile(entity) {
    return entity.getData("jmctheroes:dyn/equip") ? "BLADE" : null;
}