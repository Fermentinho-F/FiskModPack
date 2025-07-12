function haki(entity, manager) {
    if (!entity.getData("fiskheroes:blade")) {
        manager.setData(entity, "tmhp:dyn/haki", false);
    }
}
