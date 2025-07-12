var mech = implement("sabri:external/mechanics");

function init(hero) {
    hero.setName("Kang the Conqueror");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("sabri:neuro_kinetic_armor");
    hero.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);
	
    hero.addKeyBind("ENERGY_PROJECTION", "key.energyProjection", -1);
    hero.addKeyBind("AIM", "key.energyProjection", 1);
	hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
	hero.addKeyBind("SHIELD", "key.forcefield", 4);

	hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("LANDING", landingProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);

    hero.addSoundEvent("MASK_OPEN", "sabri:kang_the_conqueror_mask_disable");
    hero.addSoundEvent("MASK_CLOSE", "sabri:kang_the_conqueror_mask_enable");
    hero.addSoundEvent("AIM_START", ["sabri:kang_the_conqueror_energy_proj_charge", "sabri:kang_the_conqueror_energy_proj_ambient"]);

    hero.setTickHandler((entity, manager) => {
        var f = entity.isSprinting() && entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "sabri:dyn/kang_boost_timer", 8, f);
        manager.incrementData(entity, "sabri:dyn/single", 6, f && entity.getHeldItem().isEmpty() && !entity.isPunching());
        manager.incrementData(entity, "sabri:dyn/dual", 6, f && !entity.getHeldItem().nbt().getBoolean("Dual") && !entity.getData("fiskheroes:is_swing_in_progress"));
        manager.incrementData(entity, "sabri:dyn/single_hit", 4, entity.getData("fiskheroes:flying") && !entity.isPunching());
        manager.incrementData(entity, "sabri:dyn/dual_hit", 4, entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:is_swing_in_progress"));

        manager.incrementData(entity, "sabri:dyn/aiming_timer", 5, entity.getData('fiskheroes:telekinesis') && entity.getData('fiskheroes:grab_id') > -1);

        mech.landing(entity, manager, true, false, -1, "sabri:suit.concrete_smash", 1, 1.15 - Math.random() * 0.3);
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:water_breathing":
        return !entity.getData("fiskheroes:mask_open");
    case "fiskheroes:repulsor_blast":
        return entity.getData("fiskheroes:energy_projection_timer") == 0;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var aiming = entity.getData("fiskheroes:aiming_timer");
    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shield_blocking") && !entity.getData("fiskheroes:telekinesis");
    case "ENERGY_PROJECTION":
        return aiming == 1;
    case "TELEKINESIS":
        return aiming == 0 && !entity.getData("fiskheroes:shield_blocking");
    case "TELEPORT":
        return !entity.getData("fiskheroes:shield_blocking") && !entity.getData("fiskheroes:telekinesis");
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:flying") && entity.isOnGround() && aiming == 0 && !entity.getData("fiskheroes:telekinesis");
    default:
        return true;
    }
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.85, 1);
    profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
}

function landingProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 12.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0 ? "LANDING" : null;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:time_since_damaged") > 5;
}
