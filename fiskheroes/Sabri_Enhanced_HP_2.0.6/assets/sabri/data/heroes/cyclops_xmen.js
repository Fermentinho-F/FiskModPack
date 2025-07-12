function init(hero) {
    hero.setName("Cyclops");
    hero.setVersion("X-Men");
    hero.setTier(4);
    
    hero.setHelmet("Visor");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");
    
    hero.addPowers("sabri:optic_force", "sabri:ruby_quartz_visor");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
	
    hero.addKeyBind("HEAT_VISION", "Chaos Blast", -2);
    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("GRAVITY_MANIPULATION", "Optic Blast", 1);
    hero.addKeyBind("C_AIM", "Optic Blast", 1);
    hero.addKeyBind("AIM", "Optic Shot", 2);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("CHAOS", chaosProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.supplyFunction("canAim", canAim);

    hero.addSoundEvent("MASK_OPEN", "sabri:cyclops_xmen_chaos_blast");
    hero.addSoundEvent("MASK_CLOSE", "sabri:cyclops_xmen_chaos_blast_stop");

    hero.setTickHandler((entity, manager) => {
        manager.setData(entity, "fiskheroes:beam_charging", entity.getData("sabri:dyn/aiming_timer") == 1);
        manager.setData(entity, "fiskheroes:heat_vision", entity.getData("fiskheroes:mask_open_timer2") > 0.55);

        manager.incrementData(entity, "sabri:dyn/visor_cooldown", 100, 1, entity.getData("fiskheroes:mask_open"));

        if (entity.getData("sabri:dyn/visor_cooldown") == 1) {
            manager.setData(entity, "fiskheroes:mask_open", false);
        }
    });
}

function isModifierEnabled(entity, modifier) {
    var dial = entity.getData("fiskheroes:gravity_amount");

    switch (modifier.id()) {
        case "7":
            return dial >= 0.75;
        case "6":
            return dial >= 0.5 && dial < 0.75;
        case "5":
            return dial >= 0.25 && dial < 0.5;
        case "4":
            return dial >= -0.25 && dial < 0.25;
        case "3":
            return dial <= -0.25 && dial > -0.5;
        case "2":
            return dial <= -0.5 && dial > -0.75;
        case "1":
            return dial <= -0.75;
    }
    switch (modifier.name()) {
        case "fiskheroes:repulsor_shot":
            return entity.getData("fiskheroes:aimed_timer") == 1;
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGED_BEAM":
        case "GRAVITY_MANIPULATION":
            return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:mask_open") && entity.getData("sabri:dyn/aiming_timer") == 1 && entity.getData("fiskheroes:aiming_timer") == 0;
        case "C_AIM":
            return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:mask_open") && entity.getData('fiskheroes:time_since_damaged') > 10 && entity.getData("fiskheroes:aiming_timer") == 0;
        case "AIM":
            return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:mask_open") && entity.getData('fiskheroes:time_since_damaged') > 10 && entity.getData("sabri:dyn/aiming_timer") == 0;
        default:
            return true;
    }
}

function chaosProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", -0.5, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:heat_vision_timer") > 0 ? "CHAOS" : null;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function canAim(entity) {
    return true;
}