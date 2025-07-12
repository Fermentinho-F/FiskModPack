
function tick(entity, manager) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

    if (t == 0 && ((!entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.0 && entity.getData("fiskheroes:flight_boost_timer") > 0) || entity.getData('pwt:dyn/dive') ) && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        entity.playSound("pwt:superhero_landing.1", 1, 0.8 + Math.random() * 0.2);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 4, 10, t > 0);
}
