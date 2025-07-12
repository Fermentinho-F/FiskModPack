function init(hero) {
    hero.setName("Cyborg/Victor Stone");
    hero.setTier(7);
    
    hero.setHelmet("Mask");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    
    hero.addPowers("loriatpack:cyborg_tech");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBind("AIM", "key.aim", 1);
	hero.addKeyBind("HEAT_VISION", "Eye Beam", 2);
	hero.addKeyBind("CHARGED_BEAM", "Charged Beam", 4);
	hero.addKeyBind("TELEPORT", "Boom Tube", 3);   
	hero.addKeyBind("SHIELD", "Forcefield", 5);

	hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.addSoundEvent("STEP", "fiskheroes:iron_man_walk");
	hero.addSoundEvent("AIM_START", ["fiskheroes:mk50_cannon_aim", "fiskheroes:mk50_cannon_static"]);
    hero.addSoundEvent("AIM_STOP", "fiskheroes:mk50_cannon_retract");
	hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, entity.getData("fiskheroes:flying"));
		   });
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shield");
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}