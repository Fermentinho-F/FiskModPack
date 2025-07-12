function blackslash(entity, manager) {
    if (!entity.getData("fiskheroes:blade")) {
        manager.setData(entity, "fiskheroes:energy_charging", false);
    }
}
