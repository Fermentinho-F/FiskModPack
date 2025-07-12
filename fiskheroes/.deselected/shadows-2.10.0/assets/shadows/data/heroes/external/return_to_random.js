function returnSuit(entity, manager) {
    var nbt = entity.getWornChestplate().nbt();
    if (nbt.hasKey("SuitPicked") && entity.getHealth() < 5) {
        manager.setInteger(nbt, entity.getWornChestplate().suitType(), nbt.getInteger("Upgrades"));
        manager.setInteger(nbt, "Upgrades", 0);
        manager.removeTag(nbt, "SuitPick");
        manager.removeTag(nbt, "SuitPicked");
        manager.setString(entity.getWornHelmet().nbt(), "HeroType", "shadows:random");
        manager.setString(nbt, "HeroType", "shadows:random");
        manager.setString(entity.getWornLeggings().nbt(), "HeroType", "shadows:random");
        manager.setString(entity.getWornBoots().nbt(), "HeroType", "shadows:random");
    }

}