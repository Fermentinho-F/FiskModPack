var max = 10;
function init(hero) {
    hero.setName("Backpack");
    hero.setTier(1);

    hero.setChestplate(" ");

    hero.addPrimaryEquipment("fiskheroes:superhero_boots{HeroType:shadows:backpack_equipment_visual}", false, item => item.nbt().getString("HeroType") != "shadows:backpack");
    hero.addPrimaryEquipment("fiskheroes:superhero_leggings{HeroType:shadows:backpack_equipment_visual}", false, item => item.nbt().getString("HeroType") != "shadows:backpack");
    hero.addPrimaryEquipment("fiskheroes:superhero_chestplate{HeroType:shadows:backpack_equipment_visual}", false, item => item.nbt().getString("HeroType") != "shadows:backpack");
    hero.addPrimaryEquipment("fiskheroes:superhero_helmet{HeroType:shadows:backpack_equipment_visual}", false, item => item.nbt().getString("HeroType") != "shadows:backpack");

    hero.addKeyBindFunc("STORE", (entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        var stored = nbt.getTagList("Stored");
        var count = nbt.getTagList("Equipment").tagCount();
        if (count > 0 && stored.tagCount() < max) {
            var equipmentList = manager.newTagList();

            for (var i = 0; i < count; i++) {
                var equipmentTag = nbt.getTagList("Equipment").getCompoundTag(i);
                manager.appendTag(equipmentList, equipmentTag);

            }

            var equipmentCompound = manager.newCompoundTag();
            manager.setTagList(equipmentCompound, "Equipment", equipmentList);
            manager.appendTag(stored, equipmentCompound);

            manager.setTagList(nbt, "Stored", stored);

            manager.removeTag(nbt, "Equipment");
        }
        return true;
    }, "Store", 4);

    
    hero.addKeyBind("FULLYSTORED", "Store Limit Reached", 4);

    hero.addKeyBindFunc("TAKE", (entity, manager) => {
        var index = entity.getData("shadows:dyn/1integer_reset");
        var nbt = entity.getWornChestplate().nbt();
        if (nbt.getTagList("Equipment").tagCount() == 0 && nbt.getTagList("Stored").tagCount() > 0) {
            var stored = nbt.getTagList("Stored").getCompoundTag(index).getTagList("Equipment");
            manager.removeTag(nbt.getTagList("Stored"), index);
            manager.setTagList(nbt, "Equipment", stored);
        }
        return true;
    }, "Take", 5);

    for (var i=0; i <= max; i++) {
        for (var e=0; e <= max; e++) {
            hero.addKeyBindFunc("CYCLE" + i + e, (entity, manager) => {
                var nbt = entity.getWornChestplate().nbt();
                if (nbt.getTagList("Stored").tagCount() > 0) {
                    manager.setData(entity, "shadows:dyn/1boolean_reset", true);
                }
                return true;
            }, "Cycle <"+ i +"/"+ e +">", 3);
        }
    }

    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        var count = nbt.getTagList("Stored").tagCount();
        if (entity.getData("shadows:dyn/1boolean_reset")) {
            var data = entity.getData("shadows:dyn/1integer_reset");
            manager.setData(entity, "shadows:dyn/1integer_reset", entity.isSneaking() ? (data - 1 + count) % count : (data + 1) % count);
            manager.setData(entity, "shadows:dyn/1boolean_reset", false);
        }
        if (entity.getData("shadows:dyn/1integer_reset") > count - 1 && count > 0) {
            manager.setData(entity, "shadows:dyn/1integer_reset", count - 1);
        }
        
    });
    hero.setKeyBindEnabled((entity, keyBind) => {
        var nbt = entity.getWornChestplate().nbt();
        var count = nbt.getTagList("Stored").tagCount();
        var condition = nbt.getTagList("Stored").tagCount() > 0 ? keyBind == "CYCLE" + (entity.getData("shadows:dyn/1integer_reset") + 1) + count : keyBind == "CYCLE00";
        switch (keyBind) {
            case "STORE":
                return count < max;
            case "FULLYSTORED":
                return count == max;
            case "TAKE":
                return count > 0;
            default:
                return keyBind.startsWith("CYCLE") ? condition : true

        }
    });

    hero.addSoundEvent("WEAPON_EQUIP", "fiskheroes:utility_belt_switch");
    hero.addSoundEvent("WEAPON_UNEQUIP", "fiskheroes:utility_belt_switch");
}
