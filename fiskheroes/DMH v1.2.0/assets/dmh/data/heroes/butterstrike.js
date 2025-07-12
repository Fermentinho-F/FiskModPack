var speedster_base = implement("fiskheroes:external/speedster_base");
function init(hero) {
    hero.setName("Butterstrike");
    hero.setTier(8);

    hero.setChestplate("Wristband");

    hero.addPowers("dmh:butter", "dmh:butter_kinetic");

    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.3, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 8.0, 0);

    hero.addKeyBind("CHARGED_BEAM", "Molten Butter Blast", 1);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "Molten Butter Blast", 1);
    hero.addKeyBindFunc("BURST", (entity, manager) => {
        manager.setData(entity, "fiskheroes:speeding", false);
        return true;
    }, "Shockwave Burst", 1);
    hero.addKeyBind("BURST_VISUAL", "\u00A7mShockwave Burst", 1);

    hero.addKeyBind("ENERGY_PROJECTION", "Molten Butter Beam", 2);
    hero.addKeyBind("CHARGE_ENERGY", "Charge Punch", 2);

    hero.addKeyBind("SHADOWFORM", "Melt and Reform", 3);
    hero.addKeyBind("SUPER_SPEED", "Super Speed", 3);

    hero.addKeyBind("SHIELD", "Shield", 4);
    hero.addKeyBind("SLOW_MOTION", "Slow Motion", 4);

    hero.addKeyBind("SUIT", "Nano Transformation", 5);
    hero.addKeyBind("KINETIC", "Toggle Kinetic Mode", 5);
    hero.addKeyBind("BUTTER", "Toggle Butter Mode", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.addDamageProfile("HURT", {
        "types": {
            "BLUNT": 1.0
        }
    });
    hero.addAttributeProfile("BUTTER", butterProfile);
    hero.addAttributeProfile("NOMOVE", noMoveProfile);
    hero.addAttributeProfile("CHARGED", chargedProfile);
    hero.setAttributeProfile(getAttributeProfile);
    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.supplyFunction("canDischargeEnergy", (entity) => false);

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);

        if (entity.getData("fiskheroes:speeding") && entity.isSprinting()) {
            var list = entity.world().getEntitiesInRangeOf(entity.eyePos(), 3);
            list.forEach(other => {
                if (entity.canSee(other) && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "HURT", "%s Died by %s Speed", 2, entity);
                }
            });
        }

        if (entity.getData("dmh:dyn/transform_timer") == 0 && entity.getData("dmh:dyn/transform2")) {
            manager.setData(entity, "dmh:dyn/transform2", false);
        }

        manager.incrementData(entity, "dmh:dyn/kinetic", 80, 20, entity.isSprinting() && entity.getData("fiskheroes:speeding") && entity.getData("dmh:dyn/transform2"), !entity.getData("dmh:dyn/transform2"));

        if (entity.getData("dmh:dyn/ignite") && entity.getData("dmh:dyn/kinetic") > 0) {
            manager.setData(entity, "dmh:dyn/kinetic", 0);
        }
        if (entity.getData("dmh:dyn/ignite_timer") == 1) {
            manager.setData(entity, "dmh:dyn/ignite_timer", 0);
            manager.setData(entity, "dmh:dyn/ignite", false);
        }

        if (entity.getData("dmh:dyn/ignite") && entity.getData("dmh:dyn/ignite_timer") > 0.4 && entity.getData("dmh:dyn/ignite_timer") < 0.6) {
            var radius = entity.world().getEntitiesInRangeOf(entity.eyePos(), 6.0);
            radius.forEach(target => {
                if (!entity.equals(target) && entity.canSee(target)) {
                    target.hurtByAttacker(hero, "BURST", "%s Died By %s Lightning Burst", 25.0, entity);
                }
            });
        }

    });

    hero.addDamageProfile("BURST", {
        "types": {
            "ELECTRICITY": 0.5,
            "ENERGY": 0.5,
            "EXPLOSION": 1.0
        },
        "properties": {
            "COOK_ENTITY": true,
            "LIGHTNING_STRIKE": 0.2
        }
    });
    hero.setDamageProfile(entity => null);
}

function isModifierEnabled(entity, modifier) {
    if (!entity.getData("dmh:dyn/transform")) {
        return modifier.name() == "fiskheroes:transformation";
    }
    switch (modifier.name()) {
    case "fiskheroes:super_speed":
    case "fiskheroes:slow_motion":
    case "fiskheroes:charged_punch":
        return entity.getData("dmh:dyn/transform2");
    case "fiskheroes:speed_disintegration":
        return entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:speed") > 6;
    case "fiskheroes:charged_beam":
        return !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:energy_projection");
    case "fiskheroes:energy_projection":
        return !entity.getData("fiskheroes:shield") && !entity.getData("fiskheroes:beam_charging");
    case "fiskheroes:shield":
        return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:beam_charging");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.getData("dmh:dyn/transform_timer") < 1 || entity.getData("fiskheroes:shadowform")) {
        return entity.getData("fiskheroes:shadowform") ? keyBind == "SHADOWFORM" : keyBind == "SUIT";
    }
    switch (keyBind) {
    case "CHARGED_BEAM":
        return !entity.getData("dmh:dyn/transform2") && (entity.getData("fiskheroes:beam_charge") == 0 || entity.getData("fiskheroes:beam_charging"));
    case "CHARGED_BEAM_VISUAL":
        return !entity.getData("dmh:dyn/transform2") && entity.getData("fiskheroes:beam_charge") > 0 && !entity.getData("fiskheroes:beam_charging");
    case "SUIT":
        return entity.isSneaking() && !entity.getData("fiskheroes:mask_open");
    case "KINETIC":
        return !entity.isSneaking() || entity.getData("fiskheroes:mask_open");
    case "BUTTER":
        return (!entity.isSneaking() || entity.getData("fiskheroes:mask_open")) && entity.getData("dmh:dyn/transform2");
    case "SUPER_SPEED":
    case "FILL":
    case "CHARGE_ENERGY":
    case "SLOW_MOTION":
        return entity.getData("dmh:dyn/transform2");
    case "SHADOWFORM":
    case "SHIELD":
    case "ENERGY_PROJECTION":
        return !entity.getData("dmh:dyn/transform2");
    case "BURST":
        return entity.getData("dmh:dyn/transform2") && entity.getData("dmh:dyn/kinetic") == 1;
    case "BURST_VISUAL":
        return entity.getData("dmh:dyn/transform2") && entity.getData("dmh:dyn/kinetic") < 1;
    default:
        return true;
    }
}

function chargedProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("KNOCKBACK", 2.5, 0);
}
function butterProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 1.5, 1);
    profile.addAttribute("SPRINT_SPEED", 1.2, 1);
}
function noMoveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", -10, 1);
    profile.addAttribute("BASE_SPEED", -10, 1);
    profile.addAttribute("JUMP_HEIGHT", -10, 1);
}
function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shadowform") ? "BUTTER" : entity.getData("dmh:dyn/ignite") ? "NOMOVE" : entity.getData("fiskheroes:energy_charge") == 1 ? "CHARGED" : null;
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" && (entity.getData("dmh:dyn/transform_timer") == 1 || entity.is("DISPLAY"));
}
