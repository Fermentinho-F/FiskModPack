function init(hero) {
    hero.setName("Tornado");
    hero.setTier(2);

    hero.setChestplate("item.superhero_armor.piece.robes");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("shadows:tornado");
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 4, 0);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.addKeyBind("SHIELD", "Tornado Shield", 1);
    hero.addKeyBind("HEAT_VISION", "Tornado Shield", 1);
    
    hero.addKeyBind("CHARGED_BEAM", "Tornado Attack", 2);

    hero.addKeyBind("TORNADO_VISUAL", "Tornado", 3);
    hero.addKeyBind("TORNADO", "Tornado", 3);
    hero.addKeyBind("ENERGY_PROJECTION", "Tornado", 3);


    hero.setTickHandler((entity, manager) => {
        var data = (input) => {
            return entity.getData("shadows:dyn/"+input+"float_interp_reset");
        };
        var speed = (amount, boostAmount) => {
            return amount + (boostAmount * entity.getData('fiskheroes:flight_boost_timer'));
        };
        manager.setData(entity, "shadows:dyn/1float_interp_reset", data(1) + speed(0.1, 0.05));
        manager.setData(entity, "shadows:dyn/2float_interp_reset", data(2) + speed(0.05, 0.05));
        manager.setData(entity, "shadows:dyn/3float_interp_reset", data(3) + speed(0.02, 0.1));

        if (entity.getData("fiskheroes:shield_blocking") && !entity.isSneaking() && !(entity.world().blockAt(entity.pos().add(0, -1, 0)).isSolid()) && !entity.getData("fiskheroes:flying")) {
            manager.setData(entity, "fiskheroes:flying", true);
        }

    });

    hero.setModifierEnabled((entity, modifier) => modifier.name() != "fiskheroes:controlled_flight"  || !(entity.world().blockAt(entity.pos().add(0, -1, 0)).isSolid() && !entity.isSprinting()) || entity.getData("fiskheroes:flight_timer") < 1);

    hero.setKeyBindEnabled((entity, keyBind) => {
        switch (keyBind) {
            case "HEAT_VISION":
                return entity.getData("fiskheroes:shield_blocking_timer") == 1;
            case "SHIELD":
                return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:shield_cooldown") == 0 && (entity.getData("shadows:dyn/tornado") == 0 || entity.getData("fiskheroes:shield") && entity.getData("shadows:dyn/tornado") < 1);
            case "DISABLE_PUNCH":
                return entity.getData("fiskheroes:beam_charging") || entity.getData("shadows:dyn/1boolean_reset");
            case "CHARGED_BEAM":
                return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:shield_timer") == 0 && entity.getData("fiskheroes:flight_boost_timer") == 0;
            case "TORNADO_VISUAL":
                return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:flight_boost_timer") == 0 && entity.getData("fiskheroes:shield_blocking_timer") == 0 && !entity.getData("fiskheroes:beam_charging");
            case "TORNADO":
                return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:shield_blocking_timer") == 0 && entity.getData("fiskheroes:flight_boost_timer") == 0 && !entity.getData("fiskheroes:beam_charging") && (entity.getData("shadows:dyn/4float_interp_reset") == 0 || entity.getData("shadows:dyn/1boolean_reset"));
            case "ENERGY_PROJECTION":
                return entity.getData("shadows:dyn/1boolean_reset") && entity.getData("shadows:dyn/4float_interp_reset") == 1;
            default:
                return true;
        }
    })
    hero.setAttributeProfile(entity => entity.getData("fiskheroes:shield_blocking") ? "DONT" : null);
    hero.addAttributeProfile("DONT", profile => {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -1000, 1);
        profile.addAttribute("SPRINT_SPEED", -1000, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    });

}
