var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Kahhori \ What IF");
    hero.setTier(8);

    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");

    hero.addPowers("zaro:kahhori_physiology", "zaro:kahhori");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 4.0, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 3);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGED_BEAM", "Energy Beam", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    hero.addKeyBind("TELEPORT", "key.teleport", 3);
    hero.addKeyBind("SHIELD", "key.forcefield", 5);
    hero.addKeyBind("NEXT", "Next", 4);


    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setHasProperty(hasProperty);
      hero.setKeyBindEnabled(isKeyBindEnabled);
    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.addSoundOverrides("BARRY", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_BARRY));
    hero.addSoundOverrides("TEST", speedster_base.mergeSounds("fiskheroes:speed_force", speedster_base.SOUNDS_TEST));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
    });
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
    case "SUPER_SPEED":
          return !entity.getData("zaro:dyn/next");
   case "SLOW_MOTION":
            return !entity.getData("zaro:dyn/next");
  case "TELEKINESIS":
          return entity.getData("zaro:dyn/next");
   case "TELEPORT":
            return entity.getData("zaro:dyn/next");
    case "NEXT":
            return !entity.getData("fiskheroes:shield_blocking") && !entity.getData("fiskheroes:gravity_manip") && !entity.getData("fiskheroes:lightsout");
    default:
        return true;
    }    
}
