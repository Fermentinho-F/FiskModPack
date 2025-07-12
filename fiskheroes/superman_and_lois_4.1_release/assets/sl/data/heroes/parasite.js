var landing = implement("fiskheroes:external/superhero_landing");
var soft_landing = implement("sl:external/soft_landing");
var moonFly = implement("sl:external/moon_fly");
var speedsprint = implement("sl:external/speed_sprint");

function init(hero) {
  hero.setName("Parasite/\u00A7c\u00A7lAP 8\u00A7r");
  hero.setVersion("Ally Allston");
  hero.setTier(10);

  hero.setDefaultScale(1.02);

  hero.setHelmet("item.superhero_armor.piece.hair");
  hero.setChestplate("item.superhero_armor.piece.chestpiece");
  hero.setLeggings("item.superhero_armor.piece.pants");
  hero.setBoots("item.superhero_armor.piece.boots");

  hero.addPowers("sl:merged");
  hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
  hero.addAttribute("WEAPON_DAMAGE", -2.4, 0);
  hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
  hero.addAttribute("SPRINT_SPEED", 0.4, 1);
  hero.addAttribute("BASE_SPEED_LEVELS", 2.8, 0);
  hero.addAttribute("KNOCKBACK", 0.5, 0);
  hero.addAttribute("IMPACT_DAMAGE", 0.8, 1);

  hero.addKeyBind("TELEKINESIS", "Life Drain", 1);
  hero.addKeyBind("ENERGY_PROJECTION", "Life Drain", 1);
  hero.addKeyBind("AIM", "\u00A7mLife Drain", 1);
  hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 2);
  hero.addKeyBind("INVISIBILITY", "Invisibility", 3);
  hero.addKeyBind("TELEPORT", "Teleport", 4);
  hero.addKeyBind("CHARGED_BEAM", "Energy Projection", 5);

  hero.addSoundEvent("PUNCH", "sl:toughpunch");

  hero.setKeyBindEnabled(isKeyBindEnabled);
  hero.setModifierEnabled(isModifierEnabled);
  hero.setHasProperty(hasProperty);

  hero.setTickHandler((entity, manager) => {

  soft_landing.tick(entity, manager);
  moonFly.moonFly(entity, manager);
  speedsprint.tick(entity, manager);

    if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard" && entity.getData("fiskheroes:beam_shooting") && Math.floor(Math.random() < 0.004)) {
       manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:xkryptonite_shard");
       entity.playSound("sl:main.glassbreak", 1.0, 1.0);
    }

  var t3 = entity.getData("sl:dyn/parasite_glitch_ticks");
  if (!entity.getData("fiskheroes:mask_open") && Math.floor(Math.random() > 0.08) && Math.floor(Math.random() < 0.1)) {
    manager.setDataWithNotify(entity, "sl:dyn/parasite_glitch_ticks", t3 = 5);
  } else if (t3 > 0) {
    manager.setData(entity, "sl:dyn/parasite_glitch_ticks", --t3);
  }

  manager.incrementData(entity, "sl:dyn/parasite_glitch_timer", 2, 1, t3 > 0);

  var t2 = entity.getData("sl:dyn/speedup_ticks");
  if (!entity.getData("fiskheroes:mask_open") && Math.floor(Math.random() < 0.008)) {
    manager.setDataWithNotify(entity, "sl:dyn/speedup_ticks", t2 = 5);
    entity.playSound("sl:main.parasite", 0.2, 1.2);
  } else if (t2 > 0) {
    manager.setData(entity, "sl:dyn/speedup_ticks", --t2);
  }

  manager.incrementData(entity, "sl:dyn/speedup_timer", 2, 1, t2 > 0);
    });

}

function isModifierEnabled(entity, modifier) {
  if (modifier.name() === "fiskheroes:super_speed" && entity.getData("fiskheroes:flying")) {
    return false;
  }

  if (modifier.name() === "fiskheroes:invisibility") {
    if (entity.isPunching()) {
      return false;
    }
  }

  return true;
}

function isKeyBindEnabled(entity, keyBind) {
  if (keyBind == "TELEKINESIS" || keyBind == "ENERGY_PROJECTION") {
    return entity.getData('fiskheroes:time_since_damaged') > 30 && (entity.getData("fiskheroes:flight_boost_timer") <= 0.5);
  }
  if (keyBind == "AIM") {
    return !entity.getData("fiskheroes:energy_projection");
  }
  return keyBind != "INVISIBILITY" && keyBind != "CHARGED_BEAM" || !entity.getData("fiskheroes:energy_projection");
}
function hasProperty(entity, property) {
    switch (property) {
        case "MASK_TOGGLE":
            return true;
        case "BREATHE_SPACE":
            return true;
        default:
            return false;
    }
}
