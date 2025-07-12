function init(hero) {
    hero.setName("Onomatopoeia/\u00A7c\u00A7lAP 5\u00A7r");
    hero.setTier(2);
    hero.setDefaultScale(0.985);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("sl:sound_manipulation");
    hero.addAttribute("PUNCH_DAMAGE", 3.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.8, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

    hero.addKeyBind("AIM", "Sound Waves", 1);
    hero.addKeyBind("SONIC_WAVES", "Sound Waves", 1);
    hero.addKeyBind("CHARGED_BEAM", "Sonic Propulsion", 2);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    hero.supplyFunction("canAim", canAim);
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:cowl_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:cowl_mask_close");
    hero.addSoundEvent("AIM_START", "sl:onomo1charge");
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("shooting", shootingProfile);
    hero.setAttributeProfile(getProfile);

hero.setTickHandler((entity, manager) => {
var timer = entity.getData("sl:dyn/peia_anim_timer");
    if (entity.getData("fiskheroes:sonic_waves")) {
      manager.setData(entity, "sl:dyn/peia_anim_timer", timer + 0.1);
    } else {
      manager.setData(entity, "sl:dyn/peia_anim_timer", timer / 1.15);
    }
});


}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "SONIC_WAVES":
            return entity.getData("fiskheroes:aimed_timer") === 1.0;
        default:
            return true;
    }
}

function canAim(entity) {
    return (entity.getData("fiskheroes:mask_open_timer2") == 1 || entity.getData("fiskheroes:mask_open_timer") == 0);
}

function shootingProfile(profile) {
  profile.inheritDefaults();
  profile.addAttribute("SPRINT_SPEED", -0.285, 1);
}

function getProfile(entity) {
  if (entity.getData("fiskheroes:sonic_waves")) {
    return "shooting";
  }
  return null;
}