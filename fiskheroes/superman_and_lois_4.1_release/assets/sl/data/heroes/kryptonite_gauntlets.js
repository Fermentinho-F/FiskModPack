function init(hero) {
    hero.setName("Kryptonite/\u00A7c\u00A7lAP 2\u00A7r");
    hero.setTier(1);
    hero.setDefaultScale(1.0);

    hero.setChestplate("Gauntlets");

    hero.addPowers("sl:kryptonite_rifle");
    hero.addAttribute("PUNCH_DAMAGE", 3.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("BASE_SPEED", -0.02, 0);

    hero.addKeyBind("CHARGED_BEAM", "Shoot", 1);

    hero.addAttributeProfile("shooting", shootingProfile);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGED_BEAM":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function shootingProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("SPRINT_SPEED", -0.285, 1);
}

function getProfile(entity) {
  if (entity.getData("fiskheroes:beam_charging")) {
    return "shooting";
  }
  return null;
}
