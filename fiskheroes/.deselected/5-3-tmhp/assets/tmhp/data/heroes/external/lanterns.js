function jetpack(entity, manager) {
    if (!entity.getData("fiskheroes:flying")) {
        manager.setData(entity, "fiskheroes:dyn/nanites", false);
    }
}
function hammer(entity, manager) {
    if (!entity.getHeldItem().isEmpty()) {
        manager.setData(entity, "fiskheroes:dyn/steeled", false);
    }
    if (entity.getData('fiskheroes:dyn/steeled')) {
        manager.setData(entity, "fiskheroes:flying", false);
    }
    if (entity.getData('tmhp:dyn/mecha')) {
        manager.setData(entity, "fiskheroes:flying", false);
    }
}