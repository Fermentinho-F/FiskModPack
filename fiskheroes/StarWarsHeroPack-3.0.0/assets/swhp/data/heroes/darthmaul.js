function init(hero) {
    hero.setName("Darth Maul");
    hero.setVersion("\u00A7c\u00A7lPREQUELS\u00A7r");
    hero.setTier(8);
    
    hero.setHelmet("Head");
    hero.setChestplate("Body");
    hero.setLeggings("Legs");
    hero.setBoots("Boots");
    
    hero.addPowers("swhp:lightsaber_darthmaul", "swhp:maul_force", "swhp:doublebladespin", "swhp:formvii_juyo");
    hero.addAttribute("PUNCH_DAMAGE", 2.25, 0);
    hero.addAttribute("KNOCKBACK", 1.25, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.25, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);
    hero.addAttribute("FALL_RESISTANCE", 100.0, 0);
    
    hero.addKeyBind("LIGHTSABER", "Unholster Lightsaber", 1);
    hero.addKeyBind("HOLSTERLIGHTSABER", "Holster Lightsaber", 1);
    hero.addKeyBind("LIGHTSABERIGNITE", "Ignite Lightsaber", 2);
    hero.addKeyBind("SHIELD", "Ignite Lightsaber", 2);
    hero.addKeyBind("LIGHTSABERRETRACT", "Retract Lightsaber", 2);
    hero.addKeyBindFunc("SITH_ABILITY_CYCLE", sithabilityCycle, "Cycle Ranged/Force Abilities", 4);
    hero.addKeyBind("CHARGED_BEAM", "Throw Lightsaber", 5);
    hero.addKeyBind("TELEKINESIS", "Force Choke", 5);
    hero.addKeyBind("ENERGY_PROJECTION", "Force Choke", 5);
    hero.addKeyBind("FORCEPUSH", "Force Push", 5);
    hero.addKeyBind("VSPECIAL", "Spin Attack", 5);
    hero.addKeyBind("LIGHTSABERTHROWANIMATION", "Throw Lightsaber", 5);
    
    hero.setDefaultScale(1.0);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("LIGHTSABER", lightsaberProfile);
    hero.addAttributeProfile("LIGHTSABERIGNITE", lightsaberigniteProfile);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("SITHABILITY", sithabilityProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setHasProperty(hasProperty);

    hero.setDamageProfile(entity => entity.getData("swhp:dyn/lightsaber") ? "LIGHTSABER" : null);
    hero.addDamageProfile("LIGHTSABER", {
        "types": {
            "ENERGY": 1.0
        }
    });

    hero.addSoundEvent("MASK_OPEN", "swhp:voicelines_maul");
    hero.addSoundEvent("PUNCH", "swhp:lightsaber_swing_maul");
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function sithabilityCycle(player, manager) {
  manager.setData(player, "swhp:dyn/sith_ability_cycle", player.getData("swhp:dyn/sith_ability_cycle") + 1);
  if (player.getData("swhp:dyn/sith_ability_cycle") > 3) {
    manager.setData(player, "swhp:dyn/sith_ability_cycle", 0);
  }
  return true;
}

function lightsaberProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.3, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.2, 0);
}

function lightsaberigniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.25, 0);
    profile.addAttribute("SPRINT_SPEED", 0.3, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.2, 0);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", -1.0, 0);
}

function sithabilityProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("BASE_SPEED", -1, 0);
    profile.addAttribute("JUMP_HEIGHT", -10, 0);
}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:beam_charging") && (entity.getData("swhp:dyn/sith_ability_cycle") == 2)) {
        return "SITHABILITY";
    }
    if (entity.getData("fiskheroes:shield_blocking")) {
        return "SHIELD";
    }
    if (entity.getData("swhp:dyn/lightsaberignite")) {
        return "LIGHTSABERIGNITE";
    }
    if (entity.getData("swhp:dyn/lightsaber")) {
        return "LIGHTSABER";
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "swhp:dyn/lightsaberignite":
        return entity.getData("swhp:dyn/lightsaber");
    case "fiskheroes:shield":
        return entity.getData("swhp:dyn/lightsaber");
    case "fiskheroes:telekinesis":
        return entity.getData("swhp:dyn/jedi_ability_cycle") == 0 && entity.getData("swhp:dyn/forcechoke_cooldown") < 1;
    case "fiskheroes:energy_projection":
        return entity.getData("fiskheroes:telekinesis") && entity.getData("swhp:dyn/sith_ability_cycle") == 0;
    case "fiskheroes:charged_beam":
      switch (modifier.id()) {
        case "forcepush":
          return entity.getData("swhp:dyn/sith_ability_cycle") == 1;
        case "doublebladespin":
          return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/sith_ability_cycle") == 2;
        case "lightsaberthrow":
          return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/sith_ability_cycle") == 3;
      };
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "HOLSTERLIGHTSABER":
            return entity.getHeldItem().isEmpty() && entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/lightsaberignite_timer") == 0;
        case "LIGHTSABER":
            return entity.getHeldItem().isEmpty() && entity.getData("swhp:dyn/lightsaberignite_timer") == 0;
        case "LIGHTSABERRETRACT":
            return entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/lightsaberignite"));
        case "LIGHTSABERIGNITE":
            return entity.getData("swhp:dyn/lightsaber");
        case "SHIELD":
            return entity.getData("swhp:dyn/lightsaber");
        case "CHARGED_BEAM":
            return !entity.getData("swhp:dyn/sith_ability_cycle") == 0;
        case "TELEKINESIS":
            return entity.getData("swhp:dyn/sith_ability_cycle") == 0;
        case "ENERGY_PROJECTION":
            return entity.getData("swhp:dyn/sith_ability_cycle") == 0;
        case "FORCEPUSH":
            return entity.getData("swhp:dyn/sith_ability_cycle") == 1;
        case "VSPECIAL":
            return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/sith_ability_cycle") == 2;
        case "LIGHTSABERTHROWANIMATION":
            return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/sith_ability_cycle") == 3 && entity.getData("fiskheroes:beam_charging");
        default:
            return true;
    }
}