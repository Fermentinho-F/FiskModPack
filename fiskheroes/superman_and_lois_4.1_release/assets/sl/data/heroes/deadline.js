function init(hero) {
    hero.setName("Deadline/\u00A7c\u00A7lAP 3\u00A7r");
    hero.setTier(4);
    hero.setDefaultScale(1.0);
    hero.setHelmet("Mask");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("sl:vibration");
    hero.addAttribute("PUNCH_DAMAGE", 3.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.10, 1);

    hero.addKeyBind("HOVER", "Phase", 1);
    hero.addKeyBind("INTANGIBILITY", "Phase", 1);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sl:kryptonite_shard}", true, item => item.nbt().getString('WeaponType') === "sl:kryptonite_shard");
    hero.setModifierEnabled(isModifierEnabled);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("XK", xkryptoniteProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
hero.addDamageProfile("XK", {
    "properties": {
        "EFFECTS": [{
            "id": "minecraft:saturation",
            "duration": 20,
            "amplifier": 0
        }]
    },
    "types": {
        "XKRYPTONITE": 0.0125,
        "SHARP": 0.75
    }
});
hero.addDamageProfile("BLADE", {
    "properties": {
        "EFFECTS": [{
            "id": "minecraft:nausea",
            "duration": 20,
            "amplifier": 0
        }]
    },
    "types": {
        "KRYPTONITE": 0.0125,
        "SHARP": 0.75
    }
});

hero.setTickHandler((entity, manager) => {
  var t2 = entity.getData("sl:dyn/speedup_ticks");
  if (!entity.getData("fiskheroes:mask_open") && Math.floor(Math.random() < 0.004) && entity.getData("sl:dyn/test")) {
    manager.setDataWithNotify(entity, "sl:dyn/speedup_ticks", t2 = 5);
  } else if (t2 > 0) {
    manager.setData(entity, "sl:dyn/speedup_ticks", --t2);
  }

  manager.incrementData(entity, "sl:dyn/speedup_timer", 3, 3, t2 > 0);

    var timer = entity.getData("sl:dyn/peia_anim_timer");
    manager.setData(entity, "sl:dyn/equip_timer", 1 - timer);

    if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getByte("Count") == 0 && entity.getData("sl:dyn/peia_anim_timer") > 0) {
        manager.setData(entity, "sl:dyn/peia_anim_timer", timer - 0.1);
    } else if (entity.getWornChestplate().nbt().getTagList("Equipment").getCompoundTag("0").getCompoundTag("Item").getByte("Count") > 0) {
        manager.setData(entity, "sl:dyn/peia_anim_timer", 1);
    }

    manager.setData(entity, "fiskheroes:flying", entity.getData("fiskheroes:hovering"));
    manager.setData(entity, "sl:dyn/punch_timer", 1);
});

}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:flight":
            return entity.getData("fiskheroes:intangible") &&
                (
                    entity.world().getBlock(entity.posX(), entity.posY() + 0.7, entity.posZ()) !== "minecraft:air" ||
                    entity.world().getBlock(entity.posX(), entity.posY() - 0.7, entity.posZ()) !== "minecraft:air"
                ) &&
                !entity.isInWater();
        default:
            return true;
    }
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function xkryptoniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function getProfile(entity) {
    if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:kryptonite_shard") {
        return "BLADE";
    } else if (entity.getHeldItem().nbt().getString('WeaponType') === "sl:xkryptonite_shard") {
        return "XK";
    }
}