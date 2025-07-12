var scale = 129.25 / 32;
function isGolem(entity) {
    return entity.getData("fiskheroes:scale") >= scale && entity.getData("shadows:dyn/2boolean_reset");
}
function init(hero) {
    hero.setName("Golem");
    hero.setTier(8);

    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.shoes");

    hero.setDefaultScale(entity => entity.getData("shadows:dyn/4float_interp_reset") >= 0.35 && entity.getData("shadows:dyn/2boolean_reset") ||entity.getData("shadows:dyn/4float_interp_reset") > 0.8 && !entity.getData("shadows:dyn/2boolean_reset") || entity.as("DISPLAY").getDisplayType() == "HOLOGRAM" ? scale : 1.0);

    hero.addPowers("shadows:cursed");

    hero.addAttribute("BASE_SPEED", -0.5, 1);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("WEAPON_DAMAGE", -1, 1);
    hero.addAttribute("JUMP_HEIGHT", -10, 0);
    hero.addAttribute("PUNCH_DAMAGE", 15, 0);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Orginal Punching", -1);
    hero.addKeyBind("AIM", "Punch", -1);
    hero.addKeyBind("CHARGED_BEAM", "Ground Shatter", 3);
    hero.addKeyBind("CURSED", "Release The Curse", 5);

    hero.supplyFunction("canAim", entity => entity.getData("shadows:dyn/2float_interp_reset") == 0 && !entity.getData("fiskheroes:beam_charging"));
    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "shadows:dyn/1float_interp_reset", 5, 5.8, entity.isSneaking() && !entity.getData("shadows:dyn/1boolean_reset"));
        manager.incrementData(entity, "shadows:dyn/3float_interp_reset", 20, !entity.getData("fiskheroes:moving") && !entity.getData("shadows:dyn/1boolean_reset"));
        if (entity.getData("shadows:dyn/1boolean_reset") && !entity.getData("shadows:dyn/2boolean_reset")) {
            manager.setData(entity, "shadows:dyn/1boolean_reset", false);
        }
        if (entity.getData("fiskheroes:aiming") && !entity.getData("shadows:dyn/1boolean_reset")) {
            manager.setData(entity, "shadows:dyn/1boolean_reset", true);
        } else if (entity.getData("shadows:dyn/2float_interp_reset") == 1 && entity.getData("shadows:dyn/1boolean_reset")) {
            manager.setData(entity, "shadows:dyn/2float_interp_reset", 0);
            manager.setData(entity, "shadows:dyn/1boolean_reset", false);
        }

        if (entity.getData("fiskheroes:heat_vision")) {
            manager.setData(entity, "fiskheroes:heat_vision", false);
        }
        if (entity.getData("shadows:dyn/1boolean_reset") && entity.getData("shadows:dyn/2float_interp_reset") >= 0.55 && entity.getData("shadows:dyn/2float_interp_reset") < 0.6) {
            manager.setData(entity, "fiskheroes:heat_vision", true);
        }

        if (entity.getData("shadows:dyn/4float_interp_reset") >= 0.35 && entity.getData("shadows:dyn/2boolean_reset") && entity.getData("fiskheroes:scale") != scale) {
            manager.setData(entity, "fiskheroes:scale", scale);
        }
    });

    hero.addSoundEvent("AIM_START", "shadows:golem/punch");

    hero.addSoundEvent("STEP", "shadows:golem/step/base");
    hero.addSoundEvent("STEP", "shadows:golem/step/second");
    hero.addSoundEvent("STEP", "shadows:golem/step/sprinting");

    hero.addAttributeProfile("SEALED", profile => {
        profile.revokeAugments();
    });
    hero.addAttributeProfile("NOTHING", profile => {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -100, 1);
        profile.addAttribute("SPRINT_SPEED", -10, 1);
    });
    hero.setModifierEnabled((entity, modifier) => modifier.id() == "transform" || entity.getData("fiskheroes:scale") == scale && (modifier.name() != "fiskheroes:charged_beam" || !entity.getData("shadows:dyn/1boolean_reset")));
    hero.setTierOverride((entity, modifier) => entity.getData("fiskheroes:scale") == scale ? 8 : 1);
    hero.setAttributeProfile(entity => entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:beam_charge") >= 0.5 || entity.isSneaking() && entity.getData("fiskheroes:scale") == scale || entity.getData("shadows:dyn/1boolean_reset") || entity.getData("shadows:dyn/2boolean_reset") && entity.getData("shadows:dyn/4float_interp_reset") < 1 || entity.getData("shadows:dyn/4float_interp_reset") > 0.8 && !entity.getData("shadows:dyn/2boolean_reset") ? "NOTHING" : entity.getData("fiskheroes:scale") < scale ? "SEALED" : null);

    hero.setKeyBindEnabled((entity, keyBind) => {
        switch (keyBind) {
        case "CURSED":
            return entity.isOnGround() && (entity.getData("shadows:dyn/4float_interp_reset") == 0 || entity.getData("shadows:dyn/4float_interp_reset") == 1);
        case "CHARGED_BEAM":
        case "AIM":
            return entity.getData("fiskheroes:scale") == scale && entity.getData("shadows:dyn/4float_interp_reset") == 1 && entity.getData("fiskheroes:beam_charge") == 0; 
        case "DISABLE_PUNCH":
            return entity.getData("shadows:dyn/4float_interp_reset") > 0 && entity.getData("shadows:dyn/2boolean_reset") || entity.getData("fiskheroes:scale") == scale;
        default:
            return true;
        }
    });

}
