function init(hero) {
    hero.setName("Peter Griffin/\u00A7c\u00A7lAP 2\u00A7r");
    hero.setTier(2);
    hero.setDefaultScale(1.02);

    hero.setHelmet("item.superhero_armor.piece.hair");
    hero.setChestplate("item.superhero_armor.piece.tunic");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");

    hero.addPowers("sl:overweight", "sl:regeneration", "sl:martial_arts", "sl:cartoon_physiology", "sl:petercopter");
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.6, 0);
    hero.addAttribute("FALL_RESISTANCE", 9.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);

    hero.addKeyBind("CHARGED_BEAM", "Roadhouse Kick", 1);
    hero.addKeyBind("GRAVITY_MANIPULATION", "key.gravityManip", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
    hero.addKeyBind("REGEN_TRANSFORM", "Regeneration", 4);
    hero.addKeyBind("ACCELERATED_MAN_IS_AWESOME", "\u00A7mRegeneration", 4);
    hero.addKeyBind("PETER_COPTER", "Summon Peter-Copter", 5);
    hero.addKeyBind("FLIGHT_KEY", "Flight", 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("copter", copterProfile);
    hero.setAttributeProfile(getProfile);

    hero.addSoundEvent("EQUIP", ["sl:im_peter_griffin", "sl:my_name_is_retep"]);
    hero.addSoundEvent("PUNCH", "sl:cartoon_punch");
    hero.addSoundOverrides("retepsound", {
        "suit": {
            "EQUIP": "sl:my_name_is_retep"
        }
    });

hero.setTickHandler((entity, manager) => {

var timer = entity.getData("sl:dyn/peia_anim_timer");
if (entity.getData("sl:dyn/helicopter_flight") || entity.getData("sl:dyn/petercopter_timer") > 0 && entity.getData("sl:dyn/petercopter_timer") < 1) {
    manager.setData(entity, "sl:dyn/peia_anim_timer", timer + 0.1);
} else {
    timer /= 1.15;
    if (timer > 1) {
        timer = timer % 1;
    }
    manager.setData(entity, "sl:dyn/peia_anim_timer", timer);
}



    manager.incrementData(entity, "fiskheroes:dyn/speed_sprint_timer", 2, entity.isSprinting() && !entity.getData('fiskheroes:beam_charging') && !entity.getData("sl:dyn/petercopter"));
  if (entity.getData("sl:dyn/petercopter_timer") < 1) {
    manager.setData(entity, "sl:dyn/helicopter_flight", false);
  }
});
}

function isModifierEnabled(entity, modifier) {
  switch (modifier.name()) {
    case "fiskheroes:healing_factor":
      return entity.getData("fiskheroes:dyn/steeled");
    case "fiskheroes:flight":
      return entity.getData("sl:dyn/helicopter_flight_timer") == 1;
    default:
      break;
  }
  return true;
}


function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "FLIGHT_KEY":
        return entity.getData("sl:dyn/petercopter_timer") == 1;
    case "PETER_COPTER":
        return entity.getData("sl:dyn/petercopter_timer") == 1 || entity.getData("sl:dyn/petercopter_timer") == 0;
    case "REGEN_TRANSFORM":
        return entity.getData("fiskheroes:time_since_damaged") > 100.0 && !entity.getData("sl:dyn/petercopter");
    case "ACCELERATED_MAN_IS_AWESOME":
        return entity.getData("fiskheroes:time_since_damaged") <= 100.0 && !entity.getData("sl:dyn/petercopter");
    case "ENERGY_PROJECTION":
        return !entity.getData("fiskheroes:gravity_manip") && !entity.getData("sl:dyn/petercopter");
    case "GRAVITY_MANIPULATION":
        return !entity.getData("fiskheroes:energy_projection") && !entity.getData("sl:dyn/petercopter");
    default:
        return !entity.getData("sl:dyn/petercopter");
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:gravity_manip");
}
function copterProfile(profile) {
  profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", -100.0, 0);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 2);
}

function getProfile(entity) {
  if (entity.getData("sl:dyn/petercopter_timer") == 1 && entity.getData("sl:dyn/helicopter_flight_timer") < 1) {
    return "copter";
  }
  return null;
}