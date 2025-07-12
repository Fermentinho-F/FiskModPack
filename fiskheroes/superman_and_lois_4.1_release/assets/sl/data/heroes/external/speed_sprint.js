function tick(entity, manager) {
  manager.incrementData(
    entity,
    "fiskheroes:dyn/speed_sprint_timer",
    4,
    entity.isSprinting() &&
      entity.isSprinting() &&
      !entity.getData("fiskheroes:flying")
  );
}
