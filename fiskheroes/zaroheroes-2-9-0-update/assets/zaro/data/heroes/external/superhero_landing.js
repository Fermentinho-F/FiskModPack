function tick(entity, manager) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -0.9 && entity.getData("zaro:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 7);
        entity.playSound("zaro:main.landing", 1, 1.15 - Math.random() * 0.2);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
}
