function init(hero) {
    hero.setName("Ahsoka Tano");
    hero.setAliases("Fulcrum_Ashla", "Snips");
    hero.setVersion("\u00A76\u00A7lTCW\u00A7r");
    hero.setTier(6);
    
    hero.setHelmet("Head");
    hero.setChestplate("Body");
    hero.setLeggings("Legs");
    hero.setBoots("Boots");
    
    hero.addPowers("swhp:lightsaber_ahsoka_padawan", "swhp:padawan_force", "swhp:shotodance", "swhp:formv_shien");
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("KNOCKBACK", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.1, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("FALL_RESISTANCE", 20.0, 0);
    
    hero.addKeyBind("LIGHTSABER", "Unholster Lightsabers", 1);
    hero.addKeyBind("HOLSTERLIGHTSABER", "Holster Lightsabers", 1);
    hero.addKeyBind("LIGHTSABERIGNITE", "Ignite Lightsabers", 2);
    hero.addKeyBind("SHIELD", "Ignite Lightsabers", 2);
    hero.addKeyBind("LIGHTSABERRETRACT", "Retract Lightsabers", 2);
    hero.addKeyBindFunc("JEDI_ABILITY_CYCLE", jediabilityCycle, "Cycle Ranged/Force Abilities", 4);
    hero.addKeyBind("CHARGED_BEAM", "Throw Lightsabers", 5);
    hero.addKeyBind("TELEKINESIS", "Force Grab", 5);
    hero.addKeyBind("AIM", "Force Grab", 5);
    hero.addKeyBind("FORCEPUSH", "Force Push", 5);
    hero.addKeyBind("VSPECIAL", "Shoto Dance", 5);
    hero.addKeyBind("LIGHTSABERTHROWANIMATION", "Throw Lightsabers", 5);
    
    hero.setDefaultScale(0.9);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("LIGHTSABER", lightsaberProfile);
    hero.addAttributeProfile("LIGHTSABERIGNITE", lightsaberigniteProfile);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("JEDIABILITY", jediabilityProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);

    hero.setDamageProfile(entity => entity.getData("swhp:dyn/lightsaber") ? "LIGHTSABER" : null);
    hero.addDamageProfile("LIGHTSABER", {
        "types": {
            "ENERGY": 1.0
        }
    });

    hero.addSoundEvent("MASK_OPEN", "swhp:voicelines_ahsoka");
    hero.addSoundEvent("PUNCH", "swhp:lightsaber_swing_ahsoka");
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("swhp:dyn/jedi_ability_cycle") == 0 && entity.getData("fiskheroes:telekinesis");
}

function jediabilityCycle(player, manager) {
  manager.setData(player, "swhp:dyn/jedi_ability_cycle", player.getData("swhp:dyn/jedi_ability_cycle") + 1);
  if (player.getData("swhp:dyn/jedi_ability_cycle") > 3) {
    manager.setData(player, "swhp:dyn/jedi_ability_cycle", 0);
  }
  return true;
}

function lightsaberProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.05, 0);
}

function lightsaberigniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.05, 0);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", -1.0, 0);
}

function jediabilityProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
    profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:beam_charging") && (entity.getData("swhp:dyn/jedi_ability_cycle") == 2)) {
        return "JEDIABILITY";
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
        return entity.getData("swhp:dyn/jedi_ability_cycle") == 0 && entity.getData("swhp:dyn/forcegrab_cooldown") < 1;
    case "fiskheroes:charged_beam":
      switch (modifier.id()) {
        case "forcepush":
          return entity.getData("swhp:dyn/jedi_ability_cycle") == 1;
        case "shotodance":
          return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/jedi_ability_cycle") == 2;
        case "lightsaberthrow":
          return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/jedi_ability_cycle") == 3;
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
            return !entity.getData("swhp:dyn/jedi_ability_cycle") == 0;
        case "TELEKINESIS":
            return entity.getData("swhp:dyn/jedi_ability_cycle") == 0;
        case "AIM":
            return entity.getData("swhp:dyn/jedi_ability_cycle") == 0;
        case "FORCEPUSH":
            return entity.getData("swhp:dyn/jedi_ability_cycle") == 1;
        case "VSPECIAL":
            return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/jedi_ability_cycle") == 2;
        case "LIGHTSABERTHROWANIMATION":
            return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/jedi_ability_cycle") == 3 && entity.getData("fiskheroes:beam_charging");
        default:
            return true;
    }
}