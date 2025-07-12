function init(hero) {
    hero.setName("Odd Della Robia/\u00A7c\u00A7lAP 3");
    hero.setVersion("Code Lyoko");
    hero.setTier(3);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:virtualization_odd");
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 3.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    
    hero.addKeyBind("AIM", "Laser Arrow", 1);
    hero.addKeyBind("SHIELD", "Shield", 2);

    hero.supplyFunction("canAim", canAim);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying")) {
            manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
        }
        manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);
    });
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
    default:
        return true;
    }
}