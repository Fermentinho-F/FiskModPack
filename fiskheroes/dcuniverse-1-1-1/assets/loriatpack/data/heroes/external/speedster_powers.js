function init(hero) {
 

    hero.addAttribute("BASE_SPEED_LEVELS", 4.0, 0);

    // 1 playlist
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("HEAT_VISION", "Barrage", 3)
    // 2 playlist
    hero.addKeyBind("CHARGE_KINETIC", "Charge Kinetic Energy", 3);
    hero.addKeyBind("SONIC_WAVES", "Arm Vortex", 4);
    hero.addKeyBind("CHARGED_BEAM", "Arm Vortex", 4);
    // 3 playlist
    hero.addKeyBindFunc("func_WALL_RUN", wall_run, "Toggle Wall Run", 3);
    hero.addKeyBind("INTANGIBILITY", "Phase", 4);
// switch
    hero.addKeyBindFunc("func_SWITCH", switchAbility, "Switch Abilities", 5);

    
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.setKeyBindEnabled(isKeyBindEnabled);
	hero.setModifierEnabled(isModifierEnabled);
    hero.setDamageProfile(getDamageProfile);
    
    hero.addDamageProfile("SPEED_PUNCH", {
        "types": {
            "BLUNT": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 5
        }
    });
    
    hero.addAttributeProfile("TENLEVEL", tenProfile);
    hero.addAttributeProfile("FOURTYLEVEL", fourtyProfile);
    hero.addAttributeProfile("SIXTYLEVEL", sixtyProfile);
    hero.addAttributeProfile("HUNDREEDLEVEL", hundreedProfile);
    hero.setAttributeProfile(getProfile);

    hero.setTickHandler(tick);
    

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");

}


function tick(entity, manager) {
// lore
var nbt = entity.getWornChestplate().nbt();

lore(entity, manager);
// arm vortex
if (entity.getData("fiskheroes:beam_shooting") > 0.8) {
    manager.setData(entity, "loriatpack:dyn/vortex_active", true);
}
// wall run
  if (entity.world().getBlock(entity.pos().add(0, 0, 1)) == 'minecraft:air' 
  || entity.world().getBlock(entity.pos().add(0, 0, -1)) == 'minecraft:air'
  || entity.world().getBlock(entity.pos().add(1, 0, 0)) == 'minecraft:air'
  || entity.world().getBlock(entity.pos().add(-1, 0, 0)) == 'minecraft:air') {
      manager.setData(entity, "fiskheroes:flying", false);
    }
    // kinetic lightning
    if (entity.getData("loriatpack:dyn/charge_kinetic_cooldown") == 1) {
        manager.setData(entity, "loriatpack:dyn/charge_kinetic", false);
    }
if (entity.getData("loriatpack:dyn/charge_kinetic_timer") == 0){
    manager.setData(entity, "loriatpack:dyn/charge_kinetic_cooldown", 0);
}


// speed exp
manager.incrementData(entity, "loriatpack:dyn/speed_exp_timer", 70, 10, entity.getData("fiskheroes:speeding"));

while (entity.getData("fiskheroes:speeding") && nbt.getInteger("Exp") <= 100 && entity.getData("loriatpack:dyn/speed_exp_timer") == 1) {
    manager.setInteger(nbt, "Exp", nbt.getInteger("Exp") + 1);
      manager.setData(entity, "loriatpack:dyn/speed_exp_timer", 0);
    }
    if (entity.as("PLAYER").isCreativeMode()) {
        manager.setInteger(nbt, "Exp", 100);
    } 
    // mask
    manager.incrementData(entity, "loriatpack:dyn/mask_open_timer", 10, 15, entity.getData("fiskheroes:mask_open"));
    
    // phase
    manager.incrementData(entity, "loriatpack:dyn/phase_cooldown", 10, 15, entity.getData("fiskheroes:intangible"));
    
    // barrage
    manager.incrementData(entity, "loriatpack:dyn/rarm_timer", 10, 15, entity.getData("fiskheroes:heat_vision_timer") > 0);

    // playlist
    var playlist = entity.getData("loriatpack:dyn/playlist");
    if (playlist != 1 && playlist != 2 && playlist != 3) {
        manager.setData(entity, "loriatpack:dyn/playlist", 1);
    }
}

function switchAbility(entity, manager) {
    var playlist = entity.getData("loriatpack:dyn/playlist");
    manager.setData(entity, "loriatpack:dyn/playlist", playlist == 3 ? 1 : playlist + 1);
    return true;
}

function tenProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);;
}
function fourtyProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 6.0, 0);;
}
function sixtyProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 7.0, 0);;
}
function hundreedProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED_LEVELS", 8.0, 0);;
}

function getProfile(entity) {
    var nbt = entity.getWornChestplate().nbt();
    var speed_exp = nbt.getInteger("Exp");
    if (speed_exp == 100) {
        return "HUNDREEDLEVEL";
    } else if (speed_exp >= 60) {
        return "SIXTYLEVEL";
    } else if (speed_exp >= 40) {
        return "FOURTYLEVEL";
    } else if (speed_exp >= 10) {
        return "TENLEVEL";
    }
}


function lore(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    var speed_exp = nbt.getInteger("Exp");
    var lore = manager.newCompoundTag("{Lore:[" + "\u00A76Exp " + String(speed_exp) + "]}");
    manager.setCompoundTag(nbt, "display", lore);
}

function wall_run(entity, manager) {
var wall_run = entity.getData("loriatpack:dyn/wall_run");
  manager.setData(entity, "loriatpack:dyn/wall_run", !wall_run);
 return true;

}

function isModifierEnabled(entity, modifier) {	
	switch (modifier.name()) {
	case "fiskheroes:propelled_flight":
        return entity.getData("loriatpack:dyn/wall_run") 
        && entity.world().getBlock(entity.pos().add(0, 0, 1)) != 'minecraft:air' 
        ||entity.getData("loriatpack:dyn/wall_run") && entity.getData("fiskheroes:speeding")
        && entity.world().getBlock(entity.pos().add(0, 0, -1)) != 'minecraft:air'
        || entity.getData("loriatpack:dyn/wall_run") && entity.getData("fiskheroes:speeding")
        && entity.world().getBlock(entity.pos().add(1, 0, 0)) != 'minecraft:air'
        || entity.getData("loriatpack:dyn/wall_run") && entity.getData("fiskheroes:speeding")
        && entity.world().getBlock(entity.pos().add(-1, 0, 0)) != 'minecraft:air';
    case "fiskheroes:lightning_cast":
        return entity.getData("loriatpack:dyn/charge_kinetic_cooldown") == 1;
    case "fiskheroes:intangibility":
        return entity.getData("loriatpack:dyn/phase_cooldown") != 1;
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:intangible") && ( (entity.world().getBlock(entity.posX()+0.5, entity.posY(), entity.posZ()) != "minecraft:air") || (entity.world().getBlock(entity.posX()-0.5, entity.posY(), entity.posZ()) != "minecraft:air") 
        || (entity.world().getBlock(entity.posX(), entity.posY(), entity.posZ()-0.5) != "minecraft:air") || (entity.world().getBlock(entity.posX(), entity.posY(), entity.posZ()+0.5) != "minecraft:air")) && !entity.isInWater();

}
    return true;
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:speeding") ? "SPEED_PUNCH" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    var speed_exp = nbt.getInteger("Exp");

    if (keyBind == "HEAT_VISION") {
        return entity.getData("loriatpack:dyn/playlist") == 1;
    }
    if (keyBind == "CHARGE_KINETIC") {
        return entity.getData("fiskheroes:speeding") && entity.getData("loriatpack:dyn/charge_kinetic_cooldown") != 1 && speed_exp >= 80 && entity.getData("loriatpack:dyn/playlist") == 2;
    }
    if (keyBind == "CHARGED_BEAM") {
        return !entity.getData("loriatpack:dyn/vortex_active") && entity.getData("fiskheroes:aiming_timer") == 0 && speed_exp >= 10 && entity.getData("loriatpack:dyn/playlist") == 2;        
    }
    if (keyBind == "SONIC_WAVES") {
        return !entity.getData("fiskheroes:beam_shooting") == 0 && speed_exp >= 10 && entity.getData("loriatpack:dyn/playlist") == 2;
    }                         
    if (keyBind == "INTANGIBILITY") {
        return entity.getData("loriatpack:dyn/playlist") == 3 && speed_exp >= 60;
    }
    if (keyBind == "func_WALL_RUN") {
        return entity.getData("fiskheroes:speeding") && speed_exp >= 40 && entity.getData("loriatpack:dyn/playlist") == 3;
    }
        else if (!entity.getData("loriatpack:dyn/speed_active")) {
            return true;
        }
    }
    

