function tick(entity, manager) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

   if (t == 0 && !entity.isOnGround() && (entity.getData("sl:dyn/sboost_timer") > 0 || (entity.getData("sl:dyn/sboost2_timer") > 0 )) && entity.motionY() < -1.25 && entity.world().blockAt(entity.pos().add(0, -1, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 14);
        entity.playSound("sl:main.landing", 1, 0.8 + Math.random() * 0.2);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
}
