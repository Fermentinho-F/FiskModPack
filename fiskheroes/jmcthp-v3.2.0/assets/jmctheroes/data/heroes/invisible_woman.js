var invis = implement("jmctheroes:external/movement_invis");

function init(hero) {
    hero.setName("Invisible Woman");
    hero.setVersion("Fantastic 4");
    hero.setAliases("invisible");
    hero.setTier(4);
    
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:cosmic_ray_enhanced_physiology_invisible_woman");
    hero.addAttribute("FALL_RESISTANCE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.75, 0);
    hero.addAttribute("PUNCH_DAMAGE", 3.8, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    
    hero.addKeyBind("SHIELD", "key.forcefield", 1);
    hero.addKeyBind("INVIS", "Invisibility", 2);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 3);
    
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setModifierEnabled(isModifierEnabled);

    hero.setTickHandler((entity, manager) => {
        invis.tick(entity, manager);
    });
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -1.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -100.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:invisibility":
        return entity.getData('jmctheroes:dyn/invis_timer') == 1;  
    default:
        return true;
    }
}