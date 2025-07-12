var speedster_base = implement("fiskheroes:external/speedster_base");
var utils = implement("fiskheroes:external/utils");

function init(hero) { 
    hero.setName("The Flash/\u00A7c\u00A7lAP 4\u00A7r");
    hero.setVersion("DCEU");
    hero.setTier(5);

    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");

    hero.addPowers("sl:speed_force_dceu");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 10.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("INTANGIBILITY", "Phase", 3);
    hero.addKeyBind("HOVER", "Phase", 3);
    hero.addKeyBind("AIM", "Pose", 4);
    hero.addKeyBind("BRAKE", "Brake", 4);
    hero.addKeyBind("MINIATURIZE_SUIT", "Store Suit", 5);

    hero.addAttributeProfile("HUNGER9", hunger9Profile);
    hero.addAttributeProfile("HUNGER8", hunger8Profile);
    hero.addAttributeProfile("HUNGER7", hunger7Profile);
    hero.addAttributeProfile("HUNGER6", hunger6Profile);
    hero.addAttributeProfile("HUNGER5", hunger5Profile);
    hero.addAttributeProfile("HUNGER4", hunger4Profile);
    hero.addAttributeProfile("HUNGER3", hunger3Profile);
    hero.addAttributeProfile("HUNGER2", hunger2Profile);
    hero.addAttributeProfile("HUNGER1", hunger1Profile);
    hero.addAttributeProfile("HUNGER0", hunger0Profile);

    hero.addAttributeProfile("FLASH_POSE", flash_poseProfile);
    hero.addAttributeProfile("FLASH_BRAKE", flash_brakeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.supplyFunction("canAim", canAim);

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile((entity) => speedPunch.get(entity, null));

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
  var speed = entity.getData("fiskheroes:speed");
  var t = entity.getData("sl:dyn/speed_ticks");
  var t2 = entity.getData("sl:dyn/speedup_ticks");
  manager.setData(entity, "sl:dyn/speed", "fiskheroes:speed");

  var hunger = entity.as("PLAYER").getFoodLevel();

  if (entity.getData("fiskheroes:speed") > 2 && Math.floor(Math.random() < 0.01) && entity.getData("fiskheroes:speed_sprinting") && entity.getData("sl:dyn/speedup_timer") == 0) {
    manager.setDataWithNotify(entity, "sl:dyn/speedup_ticks", t2 = 14);
  } else if (t2 > 0) {
    manager.setData(entity, "sl:dyn/speedup_ticks", --t2);
  }

  manager.incrementData(entity, "sl:dyn/speedup_timer", 14, 12, t2 > 0);

//

  if (entity.getData("fiskheroes:speeding")) {
    manager.setDataWithNotify(entity, "sl:dyn/speed_ticks", t = 14);
  } else if (t > 0) {
    manager.setData(entity, "sl:dyn/speed_ticks", --t);
  }

  manager.incrementData(entity, "sl:dyn/speed_timer", 14, 12, t > 0);

  if (entity.getData("fiskheroes:slow_motion")) {
    manager.setDataWithNotify(entity, "fiskheroes:speeding", true);
  }

 if (entity.getData("sl:dyn/brake_timer") == 1) {
    manager.setDataWithNotify(entity, "fiskheroes:speeding", false);
  }

 if (!entity.getData("fiskheroes:speeding")) {
    manager.setDataWithNotify(entity, "sl:dyn/brake", false);
  }
    });
}

function isModifierEnabled(entity, modifier) {
    var YDif = Math.round(entity.posY()) - entity.posY();
    var hunger = entity.as("PLAYER").getFoodLevel();

    switch (modifier.name()) {
        case "fiskheroes:flight":
            return entity.getData("fiskheroes:intangible") &&
                (
                    entity.world().getBlock(entity.posX(), entity.posY() + 0.7, entity.posZ()) != "minecraft:air" ||
                    entity.world().getBlock(entity.posX(), entity.posY() - 0.7, entity.posZ()) != "minecraft:air"
                ) &&
                !entity.isInWater();
        
        case "fiskheroes:super_speed":
            return !(modifier.name() == "fiskheroes:super_speed" && hunger == 0);
        
        case "fiskheroes:propelled_flight":
            return (
                (entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(0x0, YDif, 0x1)) != 'minecraft:wheat')
                ||
                (entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(0x0, YDif, -0x1)) != 'minecraft:wheat')
                ||
                (entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(0x1, YDif, 0x0)) != 'minecraft:wheat')
                ||
                (entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:air' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:tallgrass' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:double_plant' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:sapling' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:red_flower' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:web' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:string' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:vine' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:ladder' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:carrots' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:potatoes' && entity.world().getBlock(entity.pos().add(-0x1, YDif, 0x0)) != 'minecraft:wheat')
            ) && !entity.isSneaking() && !entity.isOnGround() && !entity.isInWater() && entity.getData("fiskheroes:speeding") && !entity.getData("fiskheroes:intangible");
        
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "HOVER":
            return false;
        case "INTANGIBILITY":
            return !entity.isSprinting() && !entity.getData("fiskheroes:aiming");
        case "BRAKE":
            return entity.getData("fiskheroes:speed_sprinting") && !entity.getData("fiskheroes:aiming");
        case "AIM":
            return !entity.isSprinting();
        default:
            return true;
    }
}

function canAim(entity) {
    return !entity.isSprinting();
}

function flash_poseProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -100.0, 0);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 2);
}

function flash_brakeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -100.0, 0);
    profile.addAttribute("SPRINT_SPEED", -0.5, 0);
}

function hunger9Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 9, 0);
}

function hunger8Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 8, 0);
}

function hunger7Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 7, 0);
}

function hunger6Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 6, 0);
}

function hunger5Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 5, 0);
}

function hunger4Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 4, 0);
}

function hunger3Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 3, 0);
}

function hunger2Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 2, 0);
}

function hunger1Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 1, 0);
}

function hunger0Profile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 0, 0);
}

function getAttributeProfile(entity) {

var hunger = entity.as("PLAYER").getFoodLevel() / 2;

if (entity.getData("fiskheroes:aiming") && !entity.isSprinting()) {
    return "FLASH_POSE";
} else if (entity.getData("sl:dyn/brake")) {
    return "FLASH_BRAKE";
}

if (hunger > 8 && hunger <= 9) {
    return "HUNGER9";
} else if (hunger > 7 && hunger <= 8) {
    return "HUNGER8";
} else if (hunger > 6 && hunger <= 7) {
    return "HUNGER7";
} else if (hunger > 5 && hunger <= 6) {
    return "HUNGER6";
} else if (hunger > 4 && hunger <= 5) {
    return "HUNGER5";
} else if (hunger > 3 && hunger <= 4) {
    return "HUNGER4";
} else if (hunger > 2 && hunger <= 3) {
    return "HUNGER3";
} else if (hunger > 1 && hunger <= 2) {
    return "HUNGER2";
} else if (hunger > 0 && hunger <= 1) {
    return "HUNGER1";
} else if (hunger == 0) {
    return "HUNGER0";
}

}

