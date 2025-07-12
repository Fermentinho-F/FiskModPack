function init(hero) {
    hero.setName("Snowflame/\u00A7c\u00A7lAP 3\u00A7r");
    hero.setTier(1);
    hero.setDefaultScale(1.0);
    hero.setHelmet("Mask");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("sl:cocaine_empowerment");
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.addKeyBind("COKE", "Consume Cocaine", 1);
    hero.addPrimaryEquipment("minecraft:sugar", false, item => item.displayName() === "coke");
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.addAttributeProfile("COKE", cokeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("COKE_PUNCH", {
        "properties": {
            "EFFECTS": [{
                "id": "fiskheroes:flashbang",
                "duration": 7,
                "amplifier": 0
            }]
        },
        "types": {
            "COCAINE": 1.0,
            "BLUNT": 1.0
        }
    });
    hero.addDamageProfile("FLAME_PUNCH", {
        "properties": {
            "HEAT_TRANSFER": 20,
            "IGNITE": 2,
            "EFFECTS": [{
                "id": "fiskheroes:flashbang",
                "duration": 12,
                "amplifier": 1
            }]
        },
        "types": {
            "COCAINE": 1.0,
            "BLUNT": 1.0
        }
    });
hero.setDamageProfile(entity => {
    if (entity.getData("sl:dyn/kryptonite_timer") === 1) {
        return Math.floor(Math.random() < 0.5) ? "FLAME_PUNCH" : "COKE_PUNCH";
    } else {
        return null;
    }
});

    hero.setTickHandler((entity, manager) => {
       manager.setData(entity, "sl:dyn/kryptonite_on", entity.getData("sl:dyn/kryptonite_timer") == 1);
    if (entity.getData("sl:dyn/kryptonite_cooldown") === 1.0) {
        manager.setDataWithNotify(entity, "sl:dyn/kryptonite", false);
    }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "COKE":
            return (
                entity.getHeldItem().name() === "minecraft:sugar" &&
                entity.getHeldItem().displayName() === "coke" &&
                entity.getData("sl:dyn/kryptonite_cooldown") === 0
            );
        default:
            return false;
    }
}

function cokeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 0.8, 0);
}

function getProfile(entity) {
    if (entity.getData("sl:dyn/kryptonite_timer") === 1) {
        return "COKE";
    }
    return null;
}

function getTierOverride(entity) {
  if (entity.getData("sl:dyn/kryptonite_timer") === 1) {
    return 3;
  }

  return 1;
}