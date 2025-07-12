var mech = implement("sabri:external/mechanics");

function init(hero) {
    hero.setName("Thor");
    hero.setTier(8);
    
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("sabri:asgardian_physiology", "sabri:mjolnir");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sabri:mjolnir}", true, item => item.nbt().getString("WeaponType") == "sabri:mjolnir");
    
    hero.addKeyBind("CHARGED_BEAM", "Lightning Blast", 1);
    hero.addKeyBind("SPIN_MJOLNIR", "Spin Mjolnir", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotionHold", 4);
    
    hero.setDefaultScale(1.1);

    hero.setHasPermission((entity, permission) => permission == "USE_MJOLNIR");
    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);

    hero.addAttributeProfile("JUMP_1", firstJumpProfile);
    hero.addAttributeProfile("JUMP_2", secondJumpProfile);
    hero.addAttributeProfile("JUMP_3", thirdJumpProfile);
    hero.setAttributeProfile(getProfile);

    hero.setDamageProfile(entity => entity.getHeldItem().nbt().getString("WeaponType") == "sabri:mjolnir" ? entity.getData("sabri:dyn/mjolnir_leap_cooldown") > 0.5 ? "MJOLNIR_CHARGED" : "MJOLNIR" : null);
    hero.addDamageProfile("MJOLNIR_CHARGED", {
        "types": {
            "ELECTRICITY": 1.0,
            "MAGIC": 0.75
        }
    });
    hero.addDamageProfile("MJOLNIR", {
        "types": {
            "ELECTRICITY": 0.2,
            "MAGIC": 0.5
        }
    });

    hero.addSoundEvent("MASK_OPEN", "sabri:thor_lightning_transformation");
    hero.addSoundEvent("MASK_CLOSE", "sabri:thor_lightning_transformation");
    hero.addSoundEvent("PUNCH", ["sabri:mjolnir_hit", "sabri:mjolnir_lightning_hit"]);

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying") && entity.isSprinting()) {
            manager.setData(entity, "sabri:dyn/aiming_timer", 0);
        }

        manager.incrementData(entity, "sabri:dyn/aiming_timer", 20, 8, entity.getData("sabri:dyn/aiming"));
        manager.incrementData(entity, "sabri:dyn/flight_timer", 8, entity.getData("fiskheroes:flying") && !entity.isSprinting());

        var nbt = entity.getHeldItem().nbt();
        var mjolnir = nbt.getString("WeaponType") == "sabri:mjolnir";

        if (!entity.isSneaking() && !entity.isOnGround() && entity.getData("sabri:dyn/aiming_timer") == 1 && (entity.isSprinting() && entity.motionY() > 0.3 || entity.motionY() < -0.8)) {
            manager.setData(entity, "fiskheroes:flying", true);
        }

        mech.spaceTravel(entity, manager);
        mech.landing(entity, manager, entity.getData("sabri:dyn/superhero_landing_ticks") == 0 && !entity.isSprinting(), false, -1, "sabri:suit.concrete_smash", 1, 1.15 - Math.random() * 0.3);
        groundSlam(hero, entity, manager, "sabri:suit.thor.mjolnir.landing", 1, 1.15 - Math.random() * 0.3);
    });
}

function groundSlam(hero, entity, manager, sound, volume, pitch) {
    var t = entity.getData("sabri:dyn/superhero_landing_ticks");
    var mjolnir = entity.getHeldItem().nbt().getString("WeaponType") == "sabri:mjolnir";

    if  (mjolnir && !entity.getData("fiskheroes:flying") && entity.isSprinting() && entity.getData("sabri:dyn/mjolnir_leap_cooldown") == 1 && entity.motionY() > 0.3 && !entity.isOnGround() && entity.getData("sabri:dyn/mjolnir_leap_timer") == 0 && !entity.getData("fiskheroes:beam_shooting") && entity.getData("sabri:dyn/aiming_timer") < 1) {
        manager.setDataWithNotify(entity, "sabri:dyn/mjolnir_leap", true);
    }
    else if  (entity.isOnGround() || entity.isInWater() || !mjolnir || entity.isSneaking() || entity.getData("fiskheroes:flying") || entity.getData("fiskheroes:beam_shooting")) {
        manager.setDataWithNotify(entity, "sabri:dyn/mjolnir_leap", false);
    }

    manager.incrementData(entity, "sabri:dyn/mjolnir_leap_cooldown", 20, 8, mjolnir && t == 0 && entity.isOnGround() && !entity.isInWater() && !entity.getData("fiskheroes:beam_shooting") && entity.getData("sabri:dyn/aiming_timer") == 0 && entity.isSneaking(), !entity.isSneaking() && entity.getData("sabri:dyn/mjolnir_leap_cooldown") < 1);
    manager.incrementData(entity, "sabri:dyn/mjolnir_leap_timer", 12, entity.getData("sabri:dyn/mjolnir_leap"));
    

    if (mjolnir && t == 0 && entity.motionY() < -1.0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid() && entity.getData("sabri:dyn/mjolnir_leap") > 0 && !entity.isInWater() && !entity.getData("fiskheroes:beam_shooting")) {
        manager.setDataWithNotify(entity, "sabri:dyn/superhero_landing_ticks", t = 12);
        manager.setInterpolatedData(entity, "sabri:dyn/mjolnir_leap_cooldown", 0);
        entity.playSound(sound, volume, pitch);
    }
    else if (t > 0) {
        manager.setData(entity, "sabri:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "sabri:dyn/superhero_landing_timer", 2, 8, t > 0);

    if (entity.getData("sabri:dyn/superhero_landing_timer") >= 0.9) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 10);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
                other.hurtByAttacker(hero, "MJOLNIR_CHARGED", "%s was electrocuted by %s", 12, entity);
            }
        }
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var mjolnir = entity.getHeldItem().nbt().getString("WeaponType") == "sabri:mjolnir";

    if (keyBind != "SLOW_MOTION") {
        if (keyBind == "SPIN_MJOLNIR") {
            return mjolnir;
        }
        return true && mjolnir && !entity.getData("fiskheroes:flying") && entity.getData("sabri:dyn/aiming_timer") == 0;
    }
    return true;
}

function isModifierEnabled(entity, modifier) {
    var mjolnir = entity.getHeldItem().nbt().getString("WeaponType") == "sabri:mjolnir";

    switch (modifier.id()) {
        case "mjolnir":
            return mjolnir;
        case "leap":
            return mjolnir && !entity.getData("fiskheroes:flying") && entity.isSprinting() && entity.getData("sabri:dyn/mjolnir_leap_cooldown") == 1 && entity.getData("sabri:dyn/mjolnir_leap_timer") == 0 && !entity.getData("fiskheroes:beam_shooting") && entity.getData("sabri:dyn/aiming_timer") < 1;
      }
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("fiskheroes:dyn/superhero_landing_ticks") == 0 && mjolnir && (entity.isSprinting() && entity.getData("sabri:dyn/aiming_timer") > 0.5 || entity.getData("fiskheroes:flying") && entity.getData("sabri:dyn/flight_timer") < 1 || entity.getData("sabri:dyn/aiming_timer") > 0);
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}

function getProfile(entity) {
    var f = entity.getData("sabri:dyn/aiming_timer");
    return f == 1 && !entity.isSprinting() ? "JUMP_3" : f > 0.6 && !(f == 1 && entity.isSprinting()) ? "JUMP_2" : f > 0.3 && !(f == 1 && entity.isSprinting()) ? "JUMP_1" : null;
}

function firstJumpProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", 7.0, 0);
}

function secondJumpProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", 13.0, 0);
}

function thirdJumpProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", 20.0, 0);
}