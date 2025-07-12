var super_boost = implement("fiskheroes:external/super_boost");
var mech = implement("sabri:external/mechanics");

function init(hero) {
    hero.setName("Silver Surfer");
    hero.setVersion("Fantastic 4")
    hero.setTier(10);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.legs");
    hero.setBoots("Feet");
    
    hero.addPowers("sabri:cosmic_surfboard");
    hero.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
	
    super_boost.addKeyBind(hero, "key.boost", 1);
    hero.addKeyBind("AIM", "Cosmic Energy Blast", 1);
	hero.addKeyBind("INTANGIBILITY", "Toggle Intangibility", 2);
    hero.addKeyBind("SLOW_MOTION", "Slow-Motion Vision", 4);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.addSoundEvent("AIM_START", ["sabri:silver_surfer_cosmic_energy_charge", "sabri:silver_surfer_cosmic_energy_loop"]);

    hero.setTickHandler((entity, manager) => {
        manager.setData(entity, "fiskheroes:penetrate_martian_invis", entity.getData("fiskheroes:slow_motion"));

        mech.spaceTravel(entity, manager);
        super_boost.tick(entity, manager);
        manager.incrementData(entity, "fiskheroes:dyn/flight_super_boost_timer", 8, 14, entity.getData("fiskheroes:dyn/flight_super_boost") > 0)
        manager.incrementData(entity, "fiskheroes:dyn/steel_timer", 10, entity.getData("fiskheroes:flight_timer") == 1);
    });
}

function getTierOverride(entity) {
    return !entity.getData("fiskheroes:flying") ? 7 : 10;
}

function isKeyBindEnabled(entity, keyBind) {
        switch (keyBind) {
        case "AIM":
            return entity.getData("fiskheroes:flying") && !entity.isSprinting() && entity.getHeldItem().isEmpty();
        case "INTANGIBILITY":
            return entity.getData("fiskheroes:flying");
        default:
            return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:intangibility":
        return entity.getData("fiskheroes:flying");
    case "fiskheroes:repulsor_blast":
        return entity.getData("fiskheroes:aimed_timer") == 1;
    default:
        return super_boost.isModifierEnabled(entity, modifier);
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}