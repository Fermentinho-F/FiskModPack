function hellfire_katana(entity, manager) {
    if (entity.getHeldItem().isEmpty()) {
        manager.setData(entity, "tmhp:dyn/electrical", false);
    }
}
