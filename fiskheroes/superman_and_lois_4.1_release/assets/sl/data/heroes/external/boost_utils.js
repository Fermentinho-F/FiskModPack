function flightSL(entity, manager) {
    if (!(entity.isSprinting() && entity.getData("fiskheroes:flying"))) {
        manager.setData(entity, "sl:dyn/sboost", false);
        manager.setData(entity, "sl:dyn/sboost2", false);
    }
}
