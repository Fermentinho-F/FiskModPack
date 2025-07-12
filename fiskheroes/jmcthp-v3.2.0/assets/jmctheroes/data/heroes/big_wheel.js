function init(hero) {
    hero.setName("Jackson Weele/Big Wheel");
    hero.setVersion("item.superhero_armor.version.comics");
    hero.setAliases("Wheel");
    hero.setTier(8);
    
    hero.setChestplate("Big Mechanical Armored Monowheel");

    hero.addPowers("jmctheroes:armored_wheel");
    hero.addAttribute("JUMP_HEIGHT", -10, 1);
    hero.addAttribute("BASE_SPEED", 1.5, 1);
    hero.addAttribute("STEP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 8.0, 0);

    hero.addSoundEvent("STEP", "jmctheroes:wheel");
    hero.setDefaultScale(1.8);
    hero.setTickHandler((entity, manager)=> {
        var angle = entity.rotYaw() * Math.PI / 180;
        var offset = entity.motionZ() * Math.cos(angle) - entity.motionX() * Math.sin(angle);
        var speeding = entity.isSprinting() && entity.isOnGround() && entity.getHeldItem().isEmpty();
        var notspeeding = !entity.isSprinting() || !entity.isOnGround() || !entity.getHeldItem().isEmpty();
        manager.setData(entity, "jmctheroes:dyn/wheel_timer", entity.getData("jmctheroes:dyn/wheel_timer") + offset);
        
        manager.setData(entity, "fiskheroes:energy_projection", speeding);
        if (speeding) {
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setData(entity, "fiskheroes:shield_blocking", true);
        }
        if (notspeeding) {
            manager.setData(entity, "fiskheroes:shield", false);
            manager.setData(entity, "fiskheroes:shield_blocking", false);
        }
    });
}