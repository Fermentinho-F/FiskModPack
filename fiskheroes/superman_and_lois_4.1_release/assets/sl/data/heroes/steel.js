var landing = implement("fiskheroes:external/superhero_landing");
var throwanim = implement("sl:external/throw_animation");
var moonFly = implement("sl:external/moon_fly");

function init(hero) {
    hero.setName("Steel/\u00A7c\u00A7lAP 6\u00A7r");
    hero.setVersion("Superman & Lois");
    hero.setTier(8);

    hero.setDefaultScale(1.08);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sl:steel_armor", "sl:kinetic_hammer");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.95, 1);
    hero.addAttribute("BASE_SPEED_LEVELS", 1, 0);

    hero.addKeyBind("REMOVEPUNCH", "key.reload", -1);
    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
    hero.addKeyBind("CHARGED_BEAM", "Sonic Propulsion", 3);
    hero.addKeyBind("VHAMMERTHROW", "Throw Hammer", 3);
    hero.addKeyBind("SENTRY_MODE", "key.sentryMode", 4);
    hero.addKeyBind("CHARGE_ENERGY", "Charge Kinetic Energy", 5);
    hero.addKeyBind("HAMMER", "Call Hammer", 5);

    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:kryptonite_shard}", true, item => item.nbt().getString('WeaponType') === "sl:kryptonite_shard");

    hero.addSoundEvent("SPRINT", "sl:steel_thruster_enable");
    hero.addSoundEvent("MOVE", "sl:steel_thruster_loop");
    hero.addSoundEvent("HURT", "sl:metal_sound");
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:iron_man_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:iron_man_mask_close");
    hero.addSoundEvent("AIM_START", "sl:lasercharge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:manta_beam_stop");
    hero.addSoundEvent("STEP", ["sl:steel_walk1", "sl:steel_walk2", "fiskheroes:savitar_sprint"]);
    hero.addSoundEvent("PUNCH", "sl:hammerhit");
    hero.addSoundOverrides("MK46", {
        "suit": {
            "MASK_OPEN": "fiskheroes:iron_man_mk46_mask_open",
            "MASK_CLOSE": "fiskheroes:iron_man_mk46_mask_close"
        }
    });

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("XK", xkryptoniteProfile);
    hero.addAttributeProfile("K", kryptoniteProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("HAMMER", hammerProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
hero.addDamageProfile("BLADE", {
    "properties": {
        "EFFECTS": [{
            "id": "minecraft:nausea",
            "duration": 50,
            "amplifier": 0
        }]
    },
    "types": {
        "KRYPTONITE": 0.0125,
        "SHARP": 0.75
    }
});
hero.addDamageProfile("XK", {
    "properties": {
        "EFFECTS": [{
            "id": "minecraft:saturation",
            "duration": 20,
            "amplifier": 0
        }]
    },
    "types": {
        "XKRYPTONITE": 0.0125,
        "SHARP": 0.75
    }
});
hero.addDamageProfile("K", {
    "properties": {
        "EFFECTS": [{
            "id": "minecraft:nausea",
            "duration": 20,
            "amplifier": 0
        }]
    },
    "types": {
        "KRYPTONITE": 0.0125,
        "SHARP": 0.75
    }
});

    hero.setTickHandler((entity, manager) => {
    moonFly.moonFly(entity, manager);
    throwanim.tick(entity, manager);

  manager.incrementData(
    entity,
    "fiskheroes:dyn/speed_sprint_timer",
    4,
    entity.getData("fiskheroes:speed_sprinting") &&
      entity.isSprinting() &&
      !entity.getData("fiskheroes:flying")
  );

manager.setData(entity, "sl:dyn/hammer_pose_timer", entity.getData("sl:dyn/hammer_timer") - entity.getData("fiskheroes:beam_charge"));

//
var energyCharge = entity.getData("fiskheroes:energy_charge");
var beamCharge = entity.getData("fiskheroes:beam_charge");
var result = energyCharge - beamCharge;
if (result < 0) {    result = 0;
}
manager.setData(entity, "sl:dyn/steelchargedata", result);

if (!entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") > 0 && entity.getData("sl:dyn/hammer_profile") && entity.getData("sl:dyn/steelcooldown")) {
    manager.setData(entity, "sl:dyn/hammer", false);
}

if (!entity.getHeldItem().isEmpty() && entity.getData("sl:dyn/hammer")) {
    manager.setData(entity, "sl:dyn/hammer", false);
}

if (entity.getData("sl:dyn/hammer") && entity.getData("fiskheroes:beam_shooting")) {
    manager.setData(entity, "sl:dyn/steelcooldown", true);
} else if (entity.getData("fiskheroes:beam_charge") === 0) {
    manager.setData(entity, "sl:dyn/steelcooldown", false);
}

if (entity.getData("sl:dyn/hammer_timer") === 1) {
    manager.setData(entity, "sl:dyn/hammer_profile", true);
} else {
    manager.setData(entity, "sl:dyn/hammer_profile", false);
}

        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);

    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();

  if (!entity.getData("sl:dyn/hammer")) {
    manager.setData(entity, "fiskheroes:energy_charge", 0);
  }
  });
}

function isModifierEnabled(entity, modifier) {
  switch (modifier.name()) {
        case "fiskheroes:damage_weakness":
            switch (modifier.id()) {
                case "sound":
                    return entity.isPlayer();
                default:
                    break;
            }
    case "fiskheroes:charged_beam":
      switch (modifier.id()) {
        case "propulsion":
          return !entity.getData("sl:dyn/hammer");
        case "throw":
          return entity.getData("sl:dyn/hammer");
        default:
          break;
      }
      break;
    default:
      break;
  }
  if (modifier.name() == "fiskheroes:water_breathing") {
    return !entity.getData("fiskheroes:mask_open");
  }
  if (modifier.name() == "fiskheroes:blade") {
    return !entity.getData("fiskheroes:aiming") && !entity.getData("sl:dyn/hammer");
  }
  if (modifier.name() == "fiskheroes:super_speed") {
    return !entity.getData("fiskheroes:flying");
  }
  return true;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "AIM":
            return entity.getData("fiskheroes:energy_charge") == 0;

        case "CHARGE_ENERGY":
            return entity.getData("sl:dyn/hammer");

        case "VHAMMERTHROW":
            return entity.getData("sl:dyn/hammer_profile") && entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));

        case "CHARGED_BEAM":
            return entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));

        case "HAMMER":
            return entity.getData("sl:dyn/hammer_timer") == 0 && !entity.getData("fiskheroes:beam_charging") && entity.getHeldItem().isEmpty();

        case "REMOVEPUNCH":
            return entity.getData("fiskheroes:beam_charging") || (entity.getData("sl:dyn/hammer_timer") > 0 && entity.getData("sl:dyn/hammer_timer") < 1);

        default:
                if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return false;
    }
    return true;;
    }
}


function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && !entity.getData("fiskheroes:mask_open");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
}

function kryptoniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function xkryptoniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function hammerProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    profile.addAttribute("KNOCKBACK", 2.0, 0);
}

function getProfile(entity) {
    if (entity.getData("sl:dyn/hammer_timer") == 1 && entity.getHeldItem().isEmpty()) {
        return "HAMMER";
    } else if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard") {
        return "XK";
    } else if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard") {
        return "K";
    } else if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    } else {
        return null;
    }
}