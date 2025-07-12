function spaceTravel(entity, manager) {
    var x = entity.posX();
    var y = entity.posY();
    var z = entity.posZ();
    var dim = entity.world().getDimension();
    if (y > 1024 && entity.getData("fiskheroes:dyn/flight_super_boost") > 0) {
        manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, dim + 1));
        manager.setData(entity, "fiskheroes:teleport_delay", 1);
    }
}

function landing(entity, manager, condition, flight, motion, sound, volume, pitch) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

    if (condition && t == 0 && !entity.isOnGround() && entity.motionY() < motion && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid() && (flight ? entity.getData("fiskheroes:flight_boost_timer") > 0 : !entity.getData("fiskheroes:flying"))) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
        entity.playSound(sound, volume, pitch);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
}
