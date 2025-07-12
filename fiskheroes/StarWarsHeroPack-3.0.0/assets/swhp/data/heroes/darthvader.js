function init(hero) {
    hero.setName("Darth Vader");
    hero.setAliases("Chosen_One");
    hero.setTier(8);
    
    hero.setHelmet("Head");
    hero.setChestplate("Body");
    hero.setLeggings("Legs");
    hero.setBoots("Boots");
    
    hero.addPowers("swhp:lightsaber_darthvader", "swhp:vader_force", "swhp:mechanicalsuit", "swhp:formv_djemso");
    hero.addAttribute("PUNCH_DAMAGE", 2.5, 0);
    hero.addAttribute("KNOCKBACK", 1.25, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.9, 0);
    hero.addAttribute("BASE_SPEED", -0.1, 1);
    hero.addAttribute("SPRINT_SPEED", -0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 40.0, 0);
    
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
    hero.addKeyBind("VADERSPECIAL", "Unleash Fury", 5);
    hero.addKeyBind("LIGHTSABERTHROWANIMATION", "Throw Lightsaber", 5);
    hero.addKeyBind("MECHANICALSUIT", "Activate Mechanical Suit", 5);
    
    hero.setDefaultScale(1.05);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("MECHANICALSUIT", mechanicalsuitProfile);
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

    hero.addSoundEvent("MASK_OPEN", "swhp:voicelines_vader");
    hero.addSoundEvent("PUNCH", "swhp:lightsaber_swing");
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}

function sithabilityCycle(player, manager) {
  manager.setData(player, "swhp:dyn/sith_ability_cycle", player.getData("swhp:dyn/sith_ability_cycle") + 1);
  if (player.getData("swhp:dyn/sith_ability_cycle") > 3) {
    manager.setData(player, "swhp:dyn/sith_ability_cycle", 0);
  }
  return true;
}

function mechanicalsuitProfile(profile) {
    profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
    profile.addAttribute("BASE_SPEED", -1.0, 0);
    profile.addAttribute("JUMP_HEIGHT", -10, 0);
}

function lightsaberProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    profile.addAttribute("SPRINT_SPEED", -0.15, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.85, 0);
}

function lightsaberigniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
    profile.addAttribute("SPRINT_SPEED", -0.15, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.85, 0);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", -1.0, 0);
}

function sithabilityProfile(profile) {
    profile.revokeAugments();
    profile.addAttribute("BASE_SPEED", -1.0, 0);
    profile.addAttribute("JUMP_HEIGHT", -10, 0);
}

function getAttributeProfile(entity) {
    if (!entity.getData("swhp:dyn/mechanicalsuit")) {
        return "MECHANICALSUIT";
    }
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
    case "swhp:dyn/lightsaber":
        return entity.getData("swhp:dyn/mechanicalsuit");
    case "swhp:dyn/lightsaberignite":
        return entity.getData("swhp:dyn/lightsaber");
    case "fiskheroes:shield":
        return entity.getData("swhp:dyn/lightsaber");
    case "fiskheroes:telekinesis":
        return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 0 && entity.getData("swhp:dyn/forcechoke_cooldown") < 1;
    case "fiskheroes:energy_projection":
        return entity.getData("fiskheroes:telekinesis") && entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 0;
    case "fiskheroes:charged_beam":
      switch (modifier.id()) {
        case "forcepush":
          return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 1;
        case "fury":
          return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 2;
        case "lightsaberthrow":
          return entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/sith_ability_cycle") == 3;
      };
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "MECHANICALSUIT":
            return !entity.getData("swhp:dyn/mechanicalsuit");
        case "HOLSTERLIGHTSABER":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getHeldItem().isEmpty() && entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/lightsaberignite_timer") == 0;
        case "LIGHTSABER":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getHeldItem().isEmpty() && entity.getData("swhp:dyn/lightsaberignite_timer") == 0;
        case "LIGHTSABERRETRACT":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/lightsaberignite"));
        case "LIGHTSABERIGNITE":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/lightsaber");
        case "SHIELD":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/lightsaber");
        case "SITH_ABILITY_CYCLE":
            return entity.getData("swhp:dyn/mechanicalsuit");
        case "CHARGED_BEAM":
            return entity.getData("swhp:dyn/mechanicalsuit") && !entity.getData("swhp:dyn/sith_ability_cycle") == 0;
        case "TELEKINESIS":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 0;
        case "ENERGY_PROJECTION":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 0;
        case "FORCEPUSH":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 1;
        case "VADERSPECIAL":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/sith_ability_cycle") == 2;
        case "LIGHTSABERTHROWANIMATION":
            return entity.getData("swhp:dyn/mechanicalsuit") && entity.getData("swhp:dyn/lightsaberignite") && entity.getData("swhp:dyn/sith_ability_cycle") == 3 && entity.getData("fiskheroes:beam_charging");
        default:
            return true;
    }
}