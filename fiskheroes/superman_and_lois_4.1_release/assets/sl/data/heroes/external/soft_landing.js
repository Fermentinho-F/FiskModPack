function tick(entity, manager) {
    var t = entity.getData("sl:dyn/soft_landing_ticks");

    if (t == 0 && !entity.isOnGround() && !entity.getData("sl:dyn/sboost_timer") > 0 && !entity.getData("sl:dyn/sboost2_timer") > 0 && entity.motionY() < -1.25 && entity.world().blockAt(entity.pos().add(0, -1, 0)).isSolid() && !entity.isSprinting()) {
        manager.setDataWithNotify(entity, "sl:dyn/soft_landing_ticks", t = 14);
        entity.playSound("sl:main.soft_landing_sound", 1, 0.8 + Math.random() * 0.2);
    }
    else if (t > 0) {
        manager.setData(entity, "sl:dyn/soft_landing_ticks", --t);
    }

    manager.incrementData(entity, "sl:dyn/soft_landing_timer", 2, 12, t > 0);
}
