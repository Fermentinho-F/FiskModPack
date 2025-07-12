var mech = implement("sabri:external/mechanics");
var uuid = implement("sabri:external/uuid");

function init(hero) {
    hero.setName("Black Panther/Upgraded Habit");
    hero.setTier(8);
    
    hero.setChestplate("Necklace");
    
    hero.addPowers("fiskheroes:heart_shaped_herbs", "sabri:vibranium_nanites");
    hero.addAttribute("PUNCH_DAMAGE", 8.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);

    hero.addKeyBind("BLADE", "key.claws", 1);
    hero.addKeyBindFunc("func_FILL_KINETIC_ENERGY", fillKineticEnergyKey, "Fill Kinetic Energy", 2);
    hero.addKeyBindFunc("func_KINETIC_ENERGY_PULSE", kineticEnergyKey, "Kinetic Energy Pulse", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "key.naniteTransform", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.addAttributeProfile("CLAWS", clawsProfile);
    hero.setAttributeProfile(getProfile);
    hero.setTierOverride(getTierOverride);
    hero.setHasProperty(hasProperty);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("CLAWS", {
        "types": {
            "SHARP": 1.0
        }
    });
    hero.addDamageProfile("KINETIC_ENERGY", {
        "types": {
            "ENERGY": 1.0
        },
        "properties": {
            "ADD_KNOCKBACK": 2.0
        }
    });

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");
    /*hero.addSoundEvent("MASK_OPEN", "sabri:black_panther_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "sabri:black_panther_mask_open");*/

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "sabri:dyn/kinetic_energy_timer", 30, 6, entity.getData("fiskheroes:time_since_damaged") == 2, entity.getData("sabri:dyn/kinetic_energy_pulse"))
        manager.incrementData(entity, "sabri:dyn/kinetic_energy_effect", 6, 1, entity.getData("sabri:dyn/kinetic_energy_pulse"));
        
        if (entity.getData("sabri:dyn/kinetic_energy_timer") == 0) {
            manager.setDataWithNotify(entity, "sabri:dyn/kinetic_energy_pulse", false)
        }

        kineticEnergyBlast(hero, entity, manager)

        if (!entity.getData("sabri:dyn/vibranium_nanites")) {
            manager.setInterpolatedData(entity, "sabri:dyn/kinetic_energy_timer", 0)
        }

        mech.landing(entity, manager, entity.isSneaking(), false, -1, "sabri:suit.concrete_smash", 0.6, 1.3 - Math.random() * 0.3);

        /*if (entity.getData("sabri:dyn/kinetic_energy_timer") == 1) {
            if (entity.getData("fiskheroes:time_since_damaged") == 2) {
                manager.setDataWithNotify(entity, "sabri:dyn/kinetic_energy", entity.getData("sabri:dyn/kinetic_energy") + 1);
            }
            if (entity.getData("sabri:dyn/kinetic_energy") >= Math.max(4, entity.getData("sabri:dyn/random"))) {
                manager.setDataWithNotify(entity, "sabri:dyn/kinetic_energy", 0);
                manager.setDataWithNotify(entity, "sabri:dyn/random", Math.floor(Math.random() * 10));
                manager.setDataWithNotify(entity, "sabri:dyn/kinetic_energy_pulse", true);
                entity.playSound("sabri:suit.black_panther.kinetic_energy_pulse", 1, 1.0 - Math.random() * 0.3);
            }
        }*/
    });
}

function kineticEnergyBlast(hero, entity, manager) {
    if (entity.getData("sabri:dyn/kinetic_energy_timer") > 0 ? entity.getData("sabri:dyn/kinetic_energy_pulse") : false) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 7.5 * entity.getData("sabri:dyn/kinetic_energy_effect"));
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
                other.hurtByAttacker(hero, "KINETIC_ENERGY", "%2$s made %1$s experience kinetic energy", 12, entity);
            }
        }
    }
}

function kineticEnergyKey(entity, manager) {
    manager.setDataWithNotify(entity, "sabri:dyn/kinetic_energy_pulse", true);
    manager.setDataWithNotify(entity, "sabri:dyn/kinetic_energy", 0);
    entity.playSound("sabri:suit.black_panther.kinetic_energy_pulse", 1, 1.0 - Math.random() * 0.3);

    return true;
}

function fillKineticEnergyKey(entity, manager) {
    manager.setDataWithNotify(entity, "sabri:dyn/kinetic_energy_timer", 1);

    return true;
}

function getTierOverride(entity) {
    return entity.getData("sabri:dyn/vibranium_nanites") ? 8 : 6;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.id()) {
        case "kinetic":
            return entity.getData("sabri:dyn/vibranium_nanite_timer") == 1 && entity.getData('fiskheroes:time_since_damaged') < 3;
      }
    switch (modifier.name()) {
        case "fiskheroes:blade":
        case "fiskheroes:fire_immunity":
        case "fiskheroes:projectile_immunity":
        case "fiskheroes:damage_resistance":
            return entity.getData("sabri:dyn/vibranium_nanite_timer") == 1;
        case "fiskheroes:water_breathing":
            return !entity.getData("fiskheroes:mask_open") && entity.getData("sabri:dyn/vibranium_nanites");
        case "fiskheroes:shield":
            return !entity.isSprinting();
        default:
            return true;
    }
}

function clawsProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
}

function inactiveProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7, 0);
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
}

function getProfile(entity) {
    if (!entity.getData("sabri:dyn/vibranium_nanites")) {
        return "INACTIVE";
    }
    return entity.getData("fiskheroes:blade") ? "CLAWS" : null;
}

function hasProperty(entity, property) {
    return entity.getData("sabri:dyn/vibranium_nanite_timer") == 1 ? property == "MASK_TOGGLE" : false
}

function isKeyBindEnabled(entity, keyBind) {
    var t = entity.getData("sabri:dyn/vibranium_nanite_timer")
    switch (keyBind) {
        case "BLADE":
            return t == 1;
        case "func_FILL_KINETIC_ENERGY":
            return t == 1 && (entity.getHeldItem().name() == "minecraft:bedrock" || uuid.getUUID(entity));
        case "func_KINETIC_ENERGY_PULSE":
            return entity.getData("sabri:dyn/kinetic_energy_timer") >= 0.375 && !entity.getData("sabri:dyn/kinetic_energy_pulse");
        case "NANITE_TRANSFORM":
            return entity.getData("fiskheroes:mask_open_timer") == 0 && (t == 0 || t == 1);
        default:
            return true;
    }
}