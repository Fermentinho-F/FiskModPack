function init(hero) {
    hero.setName("Jack Kline/Nephilim & Hunter");
    hero.setTier(10);

    hero.setHelmet("Head");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addAttribute("PUNCH_DAMAGE", 20, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("IMPACT_DAMAGE", 10.0, 0);
    hero.addAttribute("MAX_HEALTH", 40, 0);

    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:dmh:angel_blade}", true, item => item.nbt().getString("WeaponType") == "dmh:angel_blade");

    hero.addPowers("dmh:jack_powers", "dmh:god_phys", "dmh:nephilim_powers");

    hero.addKeyBind("CHARGED_BEAM", "\u00A76\u00A7lMolecular Combustion", 1);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "\u00A76\u00A7m\u00A7lMolecular Combustion", 1);

    hero.addKeyBind("TELEKINESIS", "\u00A76\u00A7lTelekinesis", 3);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A76\u00A7m\u00A7lTelekinesis", 3);

    hero.addKeyBind("AIM", "\u00A76\u00A7lPyrokinesis", 4);
    hero.addKeyBind("AIM_VISUAL", "\u00A76\u00A7m\u00A7lPyrokinesis", 4);

    hero.addKeyBind("SONIC_WAVES", "\u00A76\u00A7lSonic Waves", 5);
    hero.addKeyBind("SONIC_WAVES_VISUAL", "\u00A76\u00A7m\u00A7lSonic Waves", 5);
    hero.addKeyBind("TELEPORT", "\u00A76\u00A7lTeleport", 5);

    hero.addKeyBind("ENERGY_PROJECTION", "\u00A76\u00A7lHeal", 2);
    hero.addKeyBind("ENERGY_PROJECTION_VISUAL", "\u00A76\u00A7m\u00A7lHeal", 2);
    hero.addKeyBind("ENERGY_PROJECTION_AIM", "\u00A76\u00A7lHeal", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);
    hero.addDamageProfile("HURT", {
        "types": {
            "BLUNT": 1.0
        }
    });

    hero.addSoundEvent("AIM_START", ["dmh:cgr/aim_on", "dmh:cgr/hellfire"]);
    hero.addSoundEvent("AIM_STOP", "dmh:cgr/aim_off");

    hero.setDefaultScale(1.0);
    hero.setKeyBindEnabled((entity, keyBind) => {
        switch (keyBind) {
        case "TELEPORT":
            return !entity.isSneaking();
        case "ENERGY_PROJECTION":
            return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:sonic_waves");
        case "ENERGY_PROJECTION_VISUAL":
            return entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:sonic_waves");
        case "CHARGED_BEAM":
            return !entity.getData("fiskheroes:aiming") && !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:sonic_waves");
        case "CHARGED_BEAM_VISUAL":
            return entity.getData("fiskheroes:aiming") || entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:sonic_waves");
        case "TELEKINESIS":
            return canAim(entity) && !entity.getData("fiskheroes:beam_charging");
        case "TELEKINESIS_VISUAL":
            return !canAim(entity) || entity.getData("fiskheroes:beam_charging");
        case "SONIC_WAVES":
            return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:aiming") && entity.isSneaking();
        case "SONIC_WAVES_VISUAL":
            return entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming");
        case "AIM":
            return !entity.getData("fiskheroes:sonic_waves") && !entity.getData("fiskheroes:beam_charging");
        case "AIM_VISUAL":
            return entity.getData("fiskheroes:sonic_waves") || entity.getData("fiskheroes:beam_charging");
        default:
            return true;
        }
    });


    hero.setTickHandler((entity, manager) => {
        if (entity.isSneaking()) {
            entity.world().getEntitiesInRangeOf(entity.pos(), 30).forEach(entityGrabbed => {
                var grabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
                if (entityGrabbed.isLivingEntity() && !entityGrabbed.equals(entity) && entityGrabbed.equals(grabbed)) {
                    entityGrabbed.hurtByAttacker(hero, "HURT", "%1$s was squeezed to death by %2$s.", 5, entity)
                }
            });
        }


        var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

        if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.25 && entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
            manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
            entity.playSound("fiskheroes:suit.antimonitor.forcefield.deflect", 1, 1.15 - Math.random() * 0.3);
        }
        else if (t > 0) {
            manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
        }

        manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
    });

}

function isModifierEnabled(entity, modifier) {
    var id = modifier.id();
    switch (modifier.name()) {
    default:
        return true;
    }
}

function hasPermission(entity, permission) {
    return permission == "USE_GUN" || "ANGEL_BLADE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}