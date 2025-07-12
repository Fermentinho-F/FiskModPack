function init(hero) {
    hero.setName("Loki");
    hero.setTier(10);

    hero.setHelmet("head");
    hero.setChestplate("chestplate");
    hero.setLeggings("pants");
    hero.setBoots("boots");

    hero.addPowers("zaro:god_of_stories", "zaro:stories");
    hero.addAttribute("PUNCH_DAMAGE", 130.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 6.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 8.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1000000.0, 1);

    hero.addKeyBind("CHARGED_BEAM", "Energy Beam", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
    hero.addKeyBind("SHIELD", "key.forcefield", 5);
    hero.addKeyBind("GRAVITY_MANIPULATION", "key.gravityManip", 2);
    hero.addKeyBind("SHADOWDOME", "key.shadowDome", 5);
    hero.addKeyBind("SPELL_MENU", "key.spellMenu", 3);
    hero.addKeyBind("NEXT", "Next", 4);


    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setHasProperty(hasProperty);
      hero.setKeyBindEnabled(isKeyBindEnabled);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "GRAVITY_MANIPULATION":
          return !entity.getData("zaro:dyn/next");
   case "SPELL_MENU":
            return !entity.getData("zaro:dyn/next");
   case "SHADOWDOME":
            return !entity.getData("zaro:dyn/next");
  case "TELEKINESIS":
          return entity.getData("zaro:dyn/next");
   case "TELEPORT":
            return entity.getData("zaro:dyn/next");
   case "SHIELD":
            return entity.getData("zaro:dyn/next");
    case "NEXT":
            return !entity.getData("fiskheroes:shield_blocking") && !entity.getData("fiskheroes:gravity_manip") && !entity.getData("fiskheroes:lightsout");
    default:
        return true;
    }    
}
