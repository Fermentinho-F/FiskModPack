function init(hero) {
    hero.setName("Red Skull");
    hero.setAliases("skull");
    hero.setTier(4);
    //hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jmctheroes:space_stone, ench:[], display:{Lore:[\"\u00A75\u00A7lJMCT Heroes\u00A7r\"]}}", true, item => item.nbt().getString("WeaponType") == "jmctheroes:space_stone");
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("jmctheroes:super_soldier_serum");
    hero.addAttribute("PUNCH_DAMAGE", 6.7, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.7, 0);
    hero.addAttribute("SPRINT_SPEED", 0.38, 1);

    hero.addKeyBind("SHIELD_THROW", "key.shieldThrow", 1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);

    hero.addKeyBind("TELEPORT", "\u00A7bTeleport", 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("EQUIP", "Equip/Unequip Pistol", 1);
    

    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornChestplate().nbt();
        var equipment = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
        var equiped = entity.getHeldItem().isEmpty() && equipment.getString("WeaponType") == "jmctheroes:space_stone";

        if (entity.getData("jmctheroes:dyn/space")) {
            manager.setData(entity, "jmctheroes:dyn/space", false);
        }
        if (entity.getHeldItem().nbt().getString("WeaponType") == "jmctheroes:space_stone" && (entity.getData("jmctheroes:dyn/space_timer") <= 1)) {
            manager.setData(entity, "jmctheroes:dyn/space", true);
            manager.setData(entity, "jmctheroes:dyn/space_timer", entity.getData("jmctheroes:dyn/space_timer") + 0.01);
        }
        if (entity.getHeldItem().nbt().getString("WeaponType") != "jmctheroes:space_stone"  && (entity.getData("jmctheroes:dyn/space_timer") > 0)) {
            manager.setData(entity, "jmctheroes:dyn/space_timer", entity.getData("jmctheroes:dyn/space_timer") - 0.01);
        }
        if (entity.getData("jmctheroes:dyn/space_timer") > 0.97) {
            var x = entity.posX();
            var y = entity.posY();
            var z = entity.posZ();
            var dim = entity.world().getDimension();
                manager.setData(player, "fiskheroes:teleport_dest", manager.newCoords(x, y, z, dim + 1));
                manager.setData(entity, "fiskheroes:teleport_delay", 1);
                manager.setData(entity, "jmctheroes:dyn/space_timer", 0);
        }
        if (equiped) {
            manager.setData(entity, "jmctheroes:dyn/stone", true);
        }
        if (!equiped) {
            manager.setData(entity, "jmctheroes:dyn/stone", false);
        }
        if (!entity.getHeldItem().isEmpty()) {
            manager.setData(entity, "jmctheroes:dyn/equip", false);
        }
    });
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "EQUIP":
        return entity.getHeldItem().isEmpty();
    case "TELEPORT":
        return entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == "jmctheroes:space_stone"
    case "AIM":
        return entity.getHeldItem().isGun() || entity.getHeldItem().isEmpty() && entity.getData("jmctheroes:dyn/equip");
    case "GUN_RELOAD":
        return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
    case "SHIELD_THROW":
        return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
    case "SHIELD_THROW":
        return entity.getHeldItem().name() == "fiskheroes:captain_americas_shield";
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();
    var equipment = nbt.getTagList("Equipment").getCompoundTag(0).getCompoundTag("Item").getCompoundTag("tag");
    var equiped = entity.getHeldItem().isEmpty() && equipment.getString("WeaponType") == "jmctheroes:space_stone";
    switch (modifier.name()) {
    case "fiskheroes:repulsor_blast":
        if (equiped) {
            return (modifier.id() == "energy" && (entity.getData("fiskheroes:aiming") && entity.getHeldItem().isEmpty()));
        }
        else if (!equiped) {
            return (modifier.id() == "normal" && (entity.getData("fiskheroes:aiming") && entity.getHeldItem().isEmpty()));
        }
        else {
            return false;
        }
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isGun() || entity.getData("jmctheroes:dyn/equip_timer") == 1;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" && entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == "jmctheroes:space_stone";
}

function hasPermission(entity, permission) {
    return permission == "USE_SHIELD" || permission == "USE_GUN";
}
