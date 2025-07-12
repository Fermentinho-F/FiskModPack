var speedster_base = implement("fiskheroes:external/speedster_base");

function init(hero) {
    hero.setName("Quicksilver");
    hero.setVersion("X-Men");
    hero.setTier(2);

    hero.setHelmet("item.superhero_armor.piece.glasses");
    hero.setChestplate("item.superhero_armor.piece.jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");

    hero.addPowers("sabri:super_speed");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 6.0, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Speed Knockback", -2);
    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE" && entity.getWornChestplate().nbt().getString("HeroType") != "sabri:quicksilver_xmen/mcu");

    var speedPunch = speedster_base.createSpeedPunch(hero);
    hero.setDamageProfile(entity => speedPunch.get(entity, null));

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
        manager.setData(entity, "fiskheroes:energy_projection", entity.getData("fiskheroes:speed_sprinting") && entity.getData("fiskheroes:speed") > 1);
    });
}
