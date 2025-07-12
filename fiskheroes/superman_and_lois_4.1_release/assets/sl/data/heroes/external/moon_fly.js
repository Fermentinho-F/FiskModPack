function moonFly(entity, manager) {
  var x = entity.posX();
  var y = entity.posY();
  var z = entity.posZ();
  var dim = entity.world().getDimension();
  
  if (y > 2000 && dim === 0) {
    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, 2595));
    manager.setData(entity, "fiskheroes:teleport_delay", 1);

  } else if (y > 2000 && dim === 2595) {
    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, 0));
    manager.setData(entity, "fiskheroes:teleport_delay", 1);
  }
}
