function init(hero) {
    hero.setName("Green Arrow/\u00A7c\u00A7lAP 2");
    hero.setVersion("Rebirth");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:compound_bow");
    hero.addEquipment("fiskheroes:quiver");
    
    hero.addPowers("fiskheroes:archery", "fisktag:scout");
    hero.addAttribute("PUNCH_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("BOW_DRAWBACK", 0.6, 1);
    
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasProperty(hasProperty);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying")) {
            manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
        }
        manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);
    });
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
        default:
            return false;
    }
}