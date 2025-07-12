function tick(entity, manager) {
    var t = entity.getData("sl:dyn/throw_ticks");

    if (t == 0 && entity.getData("fiskheroes:beam_shooting_timer") == 1 && entity.getData("sl:dyn/hammer_profile")) {
        manager.setDataWithNotify(entity, "sl:dyn/throw_ticks", t = 20);
        entity.playSound("sl:main.whoosh", 1, 0.8 + Math.random() * 0.2);
    }
    else if (t > 0) {
        manager.setData(entity, "sl:dyn/throw_ticks", --t);
    }

    manager.incrementData(entity, "sl:dyn/throw_timer", 16, 0, t > 0);
}
