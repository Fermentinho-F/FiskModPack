var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Doctor Manhattan");
    hero.setTier(10);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.legs");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("fiskheroes:vibranium_physiology", "emo:dr");
    hero.addAttribute("PUNCH_DAMAGE", 13.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 1);

    hero.addKeyBind("CHARGED_BEAM", "Kinetic Energy Burst", 1);
    hero.addKeyBind("INTANGIBILITY", "Intangibility", 2);
    hero.addKeyBind("TELEPORT", "Teleport", 3);
    hero.addKeyBind("SPELL_MENU", "Spell Menu", 4);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 5);
    

    hero.supplyFunction("canAim", canAim);
    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
