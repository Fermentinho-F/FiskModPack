function tick(entity, manager) {

    var item3 = player.getEquipmentInSlot(3);
    var item2 = player.getEquipmentInSlot(2);
    var item1 = player.getEquipmentInSlot(1);

  var domeId = entity.getData("fiskheroes:lightsout_id");
  var dome = entity.world().getEntityById(domeId);

if (dome.exists()) {
    var contained = dome.as("SHADOWDOME").getContainedEntities();

    for (var i = 0; i < contained.size(); ++i) {
        var inside = contained.get(i);
        if (inside.getUUID() === entity.getUUID()) {
            for (var i = 0; i < contained.size(); ++i) {
                var inside = contained.get(i);
                if (inside.getUUID() !== entity.getUUID() && entity.getData("sl:dyn/playsound") && inside.isPlayer()) {
                    entity.playSound("sl:main.superhearingsound", 1, 1.0);
                    manager.setData(entity, "sl:dyn/playsound", false);
                    manager.setString(item1.nbt(), "Detectedplayer", inside.getName());
                    manager.setData(entity, "sl:dyn/printchat", true);
                }
            }
            return true;
        }
    }
}
}
  if (entity.getData("sl:dyn/printchat")) {
    PackLoader.printChat("\u00A7k\u00A7b superhearing\u00A7r\u00A7b " + entity.getEquipmentInSlot(1).nbt().getString("Detectedplayer") + " located\u00A7k\u00A7b superhearing\u00A7r");
    manager.setData(entity, "sl:dyn/printchat", false);
  }
