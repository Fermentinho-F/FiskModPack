function init(hero) {
    hero.setName("Cyborg/\u00A7c\u00A7lAP 3");
    hero.setVersion("Teen Titans");
    hero.setTier(7);
    
    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("item.superhero_armor.piece.legs");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:cyborg");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    
    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("SONIC_WAVES", "Sonic Waves", 2);

    hero.setDefaultScale(1.1);
    hero.supplyFunction("canAim", canAim);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:sonic_waves":
        return entity.getData("fiskheroes:aimed_timer") >= 1;
    default:
        return true;
    }
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SONIC_WAVES":
        return entity.getData("fiskheroes:aimed_timer") >= 1;
    default:
        return true;
    }
}