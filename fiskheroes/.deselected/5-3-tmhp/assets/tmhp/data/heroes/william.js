var shadowform = implement("tmhp:external/shadowform");

function init(hero) {
    hero.setName("William Dunbar/\u00A7c\u00A7lAP 4");
    hero.setVersion("Code Lyoko");
    hero.setTier(3);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:virtualization_william");
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);

    hero.addKeyBind("BLADE", "Zweihander", 1);
    hero.addKeyBind("SHADOWFORM", "Super Smoke", 2);
    hero.addKeyBind("TELEKINESIS", "Super Smoke(Telekinesis)", 3);
    hero.addKeyBind("CHARGE_ENERGY", "Energy Slash", 4);
    hero.addKeyBind("SHIELD", "Block", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("BLADE", {"types": {"SHARP": 1.0}});
    hero.setTickHandler((entity, manager) => {
         shadowform.flightOnShadowForm(entity, manager);
    });
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 5.5, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:telekinesis":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shadowform");
    case "fiskheroes:controlled_flight":
        return entity.getData("fiskheroes:shadowform");
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
  switch (keyBind) {
      case "CHARGE_ENERGY":
      return entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shadowform");
      case "SHIELD":
      return entity.getData("fiskheroes:blade") && !entity.getData("fiskheroes:shadowform");
      case "TELEKINESIS":
      return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shadowform");
      default:
        return true;
  }
}
