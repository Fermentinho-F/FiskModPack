var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("The Flash/\u00A7c\u00A7lAP 9");
    hero.setVersion("Comics-New 52");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("tmhp:speed_force");
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 8.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGED_PUNCH", "Machine Gun Punch(Base)/Infinite Mass Punch(Shift)", 4);
    hero.addKeyBind("CHARGE_ENERGY", "key.chargeEnergy", 5);
    
    hero.addAttributeProfile("SPEED", speedProfile);
    hero.addAttributeProfile("PUNCH", impProfile);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setDamageProfile(getProfile);
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });

    hero.addDamageProfile("SPEED_PUNCH", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 5
        }
    });
    hero.addDamageProfile("PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "ELECTRICITY": 0.4
        },
        "properties": {
            "LIGHTNING_STRIKE": 1.0
        }
    });
    hero.addDamageProfile("BLUNT", {
        "types": {
            "BLUNT": 1.0,
            "ELECTRICITY": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 0,
            "REDUCE_KNOCKBACK": 1.0,
            "LIGHTNING_STRIKE": 0.15
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGED_PUNCH":
        return entity.getData("fiskheroes:speeding");
    case "CHARGE_ENERGY":
        return entity.getData("fiskheroes:speeding") && entity.isSprinting() || entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:energy_charging");
    default:
        return true;
    }
}
function speedProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("STEP_HEIGHT", 250.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 250.0, 0);
}
function impProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 90.5, 0);
    profile.addAttribute("KNOCKBACK", 25.0, 0);
}

function getProfile(entity) {
    if (entity.isSneaking() && entity.getData("fiskheroes:speeding")) {
        return "SPEED";
    }
    return entity.getData("fiskheroes:speeding") && entity.getData("fiskheroes:punchmode") ? entity.getData("fiskheroes:punch_charged") ? "PUNCH" : "BLUNT" : null;
}