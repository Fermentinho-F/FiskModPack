function init(hero) {
    hero.setName("Michael/Archangel");
    hero.setTier(10);

    hero.setHelmet("Head");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addAttribute("PUNCH_DAMAGE", 15, 0);
    hero.addAttribute("SPRINT_SPEED", 0.75, 1);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("IMPACT_DAMAGE", 7.0, 0);
    hero.addAttribute("KNOCKBACK", 0.40, 1);
    hero.addAttribute("MAX_HEALTH", 10.0, 0);

    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:dmh:archangel_blade}", true, item => item.nbt().getString("WeaponType") == "dmh:archangel_blade");

    hero.addPowers("dmh:archangel_phys", "dmh:low_nigh_omni", "dmh:god_phys");

    hero.addKeyBind("CHARGED_BEAM_DAMPEN", "Power Negation", 1);
    hero.addKeyBind("CHARGED_BEAM", "Holy White Light", 1);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "\u00A7mHoly White Light", 1);

    hero.addKeyBind("ENERGY_PROJECTION", "Heal", 2);
    hero.addKeyBind("ENERGY_PROJECTION_VISUAL", "\u00A7mHeal", 2);

    hero.addKeyBind("TELEKINESIS_AIM", "Telekinesis", 3);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 3);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A7mTelekinesis", 3);

    hero.addKeyBind("AIM", "Energy Blasts", 4);
    hero.addKeyBind("AIM_VISUAL", "\u00A7mEnergy Blasts", 4);

    hero.addKeyBind("TELEPORT", "Teleport", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);
    hero.addDamageProfile("HURT", {
        "types": {
            "BLUNT": 1.0
        }
    });

    hero.setDefaultScale(1.0);
    hero.setKeyBindEnabled((entity, keyBind) => {
        switch (keyBind) {
            case "CHARGED_BEAM":
                return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:aiming");
            case "CHARGED_BEAM_DAMPEN":
                return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:aiming") && entity.isSneaking();
            case "CHARGED_BEAM_VISUAL":
                return entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:energy_projection") || entity.getData("fiskheroes:aiming");
            case "ENERGY_PROJECTION":
                return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:aiming");
            case "ENERGY_PROJECTION_VISUAL":
                return entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:aiming");
            case "TELEKINESIS_AIM":
                return entity.getData("fiskheroes:grab_id") > -1;
            case "TELEKINESIS":
                return canAim(entity) && !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:energy_projection");
            case "TELEKINESIS_VISUAL":
                return !canAim(entity) || entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:energy_projection");
            case "AIM":
                return !entity.getData("fiskheroes:beam_charging") && !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:energy_projection");
            case "AIM_VISUAL":
                return entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:energy_projection");
            default:
                return true;
        }
    });


    hero.setTickHandler((entity, manager) => {
        if (entity.isSneaking()) {
            entity.world().getEntitiesInRangeOf(entity.pos(), 30).forEach(entityGrabbed => {
                var grabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
                if (entityGrabbed.isLivingEntity() && !entityGrabbed.equals(entity) && entityGrabbed.equals(grabbed)) {
                    entityGrabbed.hurtByAttacker(hero, "HURT", "%1$s was squeezed to death by %2$s.", 4, entity)
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
    case "fiskheroes:charged_beam":
        return entity.isSneaking() ? id == "power_dampen" : id == "holy_white_light";
    default:
        return true;
    }
}

function hasPermission(entity, permission) {
    return permission == "USE_GUN" || "ARCHANGEL_BLADE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}