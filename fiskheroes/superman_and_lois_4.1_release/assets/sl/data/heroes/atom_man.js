function init(hero) {
    hero.setName("Atom-Man/\u00A7c\u00A7lAP 3\u00A7r");
    hero.setTier(3);
    hero.setDefaultScale(1.04);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.coat");
    hero.setLeggings("Modest Underwear");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:flamethrower}", true, item => item.nbt().getString('WeaponType') === "sl:flamethrower");

    hero.addPowers("fiskheroes:heat_resistance", "fiskheroes:grenades", "sl:fuel_tank_backpack");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 2.5, 0);
    hero.addAttribute("BASE_SPEED", -0.02, 0);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("UTILITY_BELT", "key.grenades", 1);

    hero.addSoundEvent("AIM_START", ["sl:flamethrower_start", "sl:flamethrower_loop"]);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
    hero.setTickHandler((entity, manager) => {
        var x = entity.posX();
        var y = entity.posY();
        var z = entity.posZ();
        var dim = entity.world().getDimension();
        var oxygen = entity.getData("sl:dyn/oxygen");

if (
    entity.hasPotionEffect(2) &&
    !entity.getData("sl:dyn/isgunfrozen") &&
    entity.getHeldItem().nbt().getString('WeaponType') === "sl:flamethrower" &&
    entity.getData("fiskheroes:time_since_damaged") < 5 &&
    !entity.getData("sl:dyn/greenlight")
) {
    manager.setData(entity, "sl:dyn/isgunfrozen", true);
    manager.setData(entity, "sl:dyn/greenlight", true);
    entity.playSound("fiskheroes:modifier.cryocharge", 1, 1.0);
} else if (entity.hasPotionEffect(2)) {
    manager.setData(entity, "sl:dyn/greenlight", true);
} else {
    manager.setData(entity, "sl:dyn/greenlight", false);
}

if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getByte("Count") > 0 && !entity.getData("sl:dyn/playclicksound")) {
    manager.setData(entity, "sl:dyn/playclicksound", true);
    entity.playSound("sl:main.metal_click", 1, 1.0);
} else if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getByte("Count") == 0) {
    manager.setData(entity, "sl:dyn/playclicksound", false);
}

        if (!entity.hasPotionEffect(2) && entity.getData("sl:dyn/isgunfrozen") && entity.getHeldItem().nbt().getString('WeaponType') === "sl:flamethrower") {
            manager.setData(entity, "sl:dyn/isgunfrozen", false);
        }

        if (entity.getData("sl:dyn/oxygen") > 0.99) {
            manager.setData(entity, "sl:dyn/isreadytoshoot", true);
        }

        if (entity.getData("sl:dyn/oxygen") < 0.5) {
            manager.setData(entity, "sl:dyn/isreadytoshoot", false);
        }

        if (entity.getData("fiskheroes:aiming")) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen + 0.005);
        }

        if (!entity.getData("fiskheroes:aiming") && entity.getData("sl:dyn/oxygen") > 0 && entity.world().getBlock(entity.pos().add(0.0, 1.5, 0.0)).id !== "minecraft:water" && entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getByte("Count") > 0) {
            manager.setData(entity, "sl:dyn/oxygen", oxygen - 0.005);
        }

        if (dim !== 2595) {
            manager.setData(entity, "sl:dyn/notonmoon", true);
        } else {
            manager.setData(entity, "sl:dyn/notonmoon", false);
        }
    });
}

function isModifierEnabled(entity, modifier) {
    if (modifier === "fiskheroes:flame_blast") {
        if (entity.getData("sl:dyn/oxygen") > 0.8) {
            return entity.getData("sl:dyn/oxygen") < 1;
        } else {
            return entity.getData("sl:dyn/oxygen") < 1;
        }
    } else {
        // Handle other cases if needed
        return true;
    }
}

function hasPermission(entity, permission) {
    return permission === "USE_FLAMETHROWER";
}

function canAim(entity) {
    return entity.getHeldItem().nbt().getString('WeaponType') === "sl:flamethrower" && entity.getData("sl:dyn/oxygen") < 1 && !entity.getData("sl:dyn/isreadytoshoot") && !entity.getData("sl:dyn/isgunfrozen") && entity.getData("sl:dyn/notonmoon");
}
