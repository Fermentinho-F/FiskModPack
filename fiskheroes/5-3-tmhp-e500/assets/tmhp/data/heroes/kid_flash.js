var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Kid Flash/\u00A7c\u00A7lAP 1");
    hero.setVersion("Comics/Teen Titans");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");
    
    hero.addPowers("tmhp:speed_force", "fiskheroes:energy_manipulation");
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 3.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGE_ENERGY", "key.chargeEnergy", 5);
    
    hero.setDefaultScale(0.87);
    hero.addAttributeProfile("SPEED", speedProfile);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setDamageProfile(getDamageProfile);
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
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
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

function getProfile(entity) {
    return entity.isSneaking() && entity.getData("fiskheroes:speeding") ? "SPEED" : null;
}