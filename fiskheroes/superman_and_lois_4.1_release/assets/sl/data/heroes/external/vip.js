function pinkKryptonitevip(entity, manager) {
if (entity.getUUID() === "07fed8f8-f88f-477b-9b1e-9012ce0edc3d" || entity.getUUID() === "7630ded1-eecb-4ab9-8f85-bc7f5ac5bde2") {
    if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard" && entity.isSneaking()) {
       manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:pink_kryptonite_shard");
    }
}
if (entity.getUUID() === "07fed8f8-f88f-477b-9b1e-9012ce0edc3d" || entity.getUUID() === "7630ded1-eecb-4ab9-8f85-bc7f5ac5bde2") {
    if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard" && entity.isSneaking()) {
       manager.setString(entity.getHeldItem().nbt(), "WeaponType", "sl:blue_kryptonite_shard");
    }
}
}
