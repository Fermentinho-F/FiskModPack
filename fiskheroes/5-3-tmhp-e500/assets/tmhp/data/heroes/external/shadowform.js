function flightOnShadowForm(entity, manager) {
    if (entity.getData("fiskheroes:shadowform")) {
        manager.setData(entity, "fiskheroes:flying", true);
    }
    if (!entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "fiskheroes:shadowform", false);
    }
}
