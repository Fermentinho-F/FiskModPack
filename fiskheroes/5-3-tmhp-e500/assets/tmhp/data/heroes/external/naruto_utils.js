function rage(entity, manager) {
    if (entity.getData("tmhp:dyn/one_tail_cooldown") && !entity.getData("tmhp:dyn/one_tailed")) {
        manager.setData(entity, "tmhp:dyn/rage", false);
    }
}
function one_tail(entity, manager) {
    if (!entity.getData("tmhp:dyn/rage")) {
        manager.setData(entity, "tmhp:dyn/one_tailed", false);
    }
}
function curse_mark(entity, manager) {
    if (!entity.getData("tmhp:dyn/sharingan")) {
        manager.setData(entity, "tmhp:dyn/curse_mark", false);
    }
}