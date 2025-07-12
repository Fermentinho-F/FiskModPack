function init(hero) {

    hero.addKeyBind("CHARGED_BEAM5", "Mind Stone Blast", 1);
    hero.addKeyBind("INVISIBILITY1", "Hide", 3);  

    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("BLADE", "key.claws", 1);
    hero.addKeyBindFunc("func_PEPSI_DRINK", pepsiDrinkKey, "Drink", 1);
    hero.addKeyBindFunc("func_KINETIC_ENERGY_PULSE", kineticEnergyKey, "Kinetic Energy Pulse", 2);
    hero.addKeyBindFunc("func_FROUND", galvanTinkerKey, "F*ck around, find out", 3);
    hero.addKeyBind("func_-FROUND", "\u00A7mF*ck around, find out", 3);
    hero.addKeyBindFunc("func_EQUIP_MODE", equipmentMode, "Switch equipment Mode", 3);
    hero.addKeyBind("INVISIBILITY", "Invisibility", 3);  
    hero.addKeyBind("GREY_MATTER_BP", "key.naniteTransform", 4);

    hero.addAttributeProfile("GREY_MATTER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -5.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.5, 0);
        profile.addAttribute("SPRINT_SPEED", -0.05, 1);
        profile.addAttribute("BASE_SPEED", -0.25, 1);
        profile.addAttribute("MAX_HEALTH", -14, 0);
    });

    hero.addAttributeProfile("GREY_MATTER_PEPSI", profile => {
        profile.addAttribute("FALL_RESISTANCE", 2.5, 0);
        profile.addAttribute("SPRINT_SPEED", 0.5, 1);
        profile.addAttribute("BASE_SPEED", 0.25, 1);
        profile.addAttribute("MAX_HEALTH", -14, 0);
    });

    hero.addAttributeProfile("GREY_MATTER_VISION", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -5.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 0);
        profile.addAttribute("SPRINT_SPEED", -0.1, 1);
        profile.addAttribute("BASE_SPEED", -0.75, 1);
        profile.addAttribute("MAX_HEALTH", -14, 0);
    });

    hero.addAttributeProfile("GREY_MATTER_BLACK_PANTHER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.5, 0);
        profile.addAttribute("WEAPON_DAMAGE", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("BASE_SPEED", -0.2, 1);
        profile.addAttribute("MAX_HEALTH", -14, 0);
    });
    hero.addAttributeProfile("GREY_MATTER_BLACK_PANTHER_CLAWS", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("BASE_SPEED", -0.2, 1);
        profile.addAttribute("MAX_HEALTH", -14, 0);
    });

    hero.addAttributeProfile("GREY_MATTER_STATIONARY", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.5, 0);
        profile.addAttribute("JUMP_HEIGHT", -10.0, 1);
        profile.addAttribute("SPRINT_SPEED", -10.0, 1);
        profile.addAttribute("BASE_SPEED", -10.0, 1);
        profile.addAttribute("MAX_HEALTH", -14, 0);
    });
}

function getAttributeProfile(entity) {
    var pepsi = entity.getData('tmf:dyn/p_2');	
    var vision = entity.getHeldItem().nbt().getString("WeaponType") == "tmf:vision_head";
    var bp = entity.getData('tmf:dyn/grey_matter_panther_timer');		
    if (pepsi && !vision && bp == 0) {
        return "GREY_MATTER_PEPSI";
    }
    if (vision && !pepsi && bp == 0) {
        return "GREY_MATTER_VISION";
    }
    if (bp == 1) {
        return entity.getData('fiskheroes:blade') ? "GREY_MATTER_BLACK_PANTHER_CLAWS" : "GREY_MATTER_BLACK_PANTHER";
    }
    if (entity.getData('tmf:dyn/p_1')) {
        return "GREY_MATTER_STATIONARY";
    }
    return "GREY_MATTER";
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }

    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("grey_matter");

    if (SL < 60) {
        manager.setByte(nbt, "grey_matter", 60);
    }

    manager.incrementData(entity, "tmf:dyn/pt_1", 30, entity.getData('tmf:dyn/p_1'));
    manager.incrementData(entity, "tmf:dyn/pc_1", 500, entity.getData('tmf:dyn/p_2'));
    if (entity.getData('tmf:dyn/pt_1') == 1) {
        manager.setData(entity, 'tmf:dyn/p_1', false);
        manager.setData(entity, 'tmf:dyn/p_2', true);
    }
    if (entity.getData('tmf:dyn/pc_1') == 1) {
        manager.setData(entity, 'tmf:dyn/p_2', false);
        manager.setData(entity, 'tmf:dyn/pc_1', 0);
    }

    if (entity.getData('tmf:dyn/grey_matter_panther_timer') != 0) {
        manager.incrementData(entity, "tmf:dyn/pt_4", 30, 6, entity.getData("fiskheroes:time_since_damaged") == 2, entity.getData("tmf:dyn/p_4"))
        manager.incrementData(entity, "tmf:dyn/pc_4", 6, 1, entity.getData("tmf:dyn/p_4"))

        
        if (entity.getData("tmf:dyn/pt_4") == 0) {
            manager.setDataWithNotify(entity, "tmf:dyn/p_4", false)
        }
        
        manager.setDataWithNotify(entity, "fiskheroes:heat_vision", entity.getData("tmf:dyn/pt_4") > 0 ? entity.getData("tmf:dyn/p_4") : false)

        if (!entity.getData("tmf:dyn/grey_matter_panther")) {
            manager.setInterpolatedData(entity, "tmf:dyn/pt_4", 0)
        }
        if (entity.getData("tmf:dyn/pc_5") == 1) {
            manager.setData(entity, "tmf:dyn/grey_matter_panther", false)
        }
    }
    manager.incrementData(entity, "tmf:dyn/pc_5", 1200, 600, entity.getData("tmf:dyn/grey_matter_panther"), !entity.getData("tmf:dyn/grey_matter_panther"))
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("grey_matter");
    var item = entity.getHeldItem();
    var visionHeld = item.name() == "fisktag:weapon" && item.nbt().getString("WeaponType") == "tmf:vision_head";

    if (modifier.id() == "grey_matter_1") {
        return  visionHeld;
    }
    if (modifier.id().startsWith("grey_matter_bp_")) {
        return entity.getData('tmf:dyn/grey_matter_panther');
    }
    if (modifier.id() == "grey_matter_b2") {
        return true;
    }
    if (modifier.id() == "grey_matter_b3") {
        return true;
    }
    if (modifier.id() == "grey_matter_10") {
        return true;
    }

    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("grey_matter");
    var item = entity.getHeldItem();
    var visionHeld = item.name() == "fisktag:weapon" && item.nbt().getString("WeaponType") == "tmf:vision_head";
    var pepsiHeld = item.name() == "fisktag:weapon" && item.nbt().getString("WeaponType") == "tmf:pepsi";
    var slot0 = nbt.getTagList('Equipment').getCompoundTag(0).getCompoundTag('Item').getCompoundTag('tag').getString("HeroType").contains("sabri:black_panther");
    var blockBelow_1 = entity.world().getBlock(entity.pos().add(0, -0.5, 0));
    var blockBelow_2 = entity.world().getBlock(entity.pos().add(0, -0.1, 0));

    
    var itemInSlot0 = getEquipmentItemInSlot(nbt, 0);
    var itemInSlot1 = getEquipmentItemInSlot(nbt, 1);
    var itemInSlot2 = getEquipmentItemInSlot(nbt, 2);
    var itemInSlot3 = getEquipmentItemInSlot(nbt, 3);
    var itemInSlot4 = getEquipmentItemInSlot(nbt, 4);

    var gm1 = entity.getWornChestplate().nbt().getString("HeroType") == "tmf:omnitrix_grey_matter" && (itemInSlot1 != null || itemInSlot2 != null || itemInSlot3 != null);
    var gm2 = entity.getWornChestplate().nbt().getString("HeroType") == "tmf:omnitrix_grey_matter_crafting" && (itemInSlot0 != null && itemInSlot1 != null && itemInSlot2 != null && itemInSlot3 != null  && itemInSlot4 != null) && (itemInSlot2.getByte("Count") >= 3 && itemInSlot3.getByte("Count") >= 4);

    if (keyBind == "CHARGED_BEAM5") {
        return visionHeld;
    }
    if (keyBind == "INVISIBILITY1") {
        return blockBelow_1 == "minecraft:jukebox" || blockBelow_2 == "minecraft:flower_pot";
    }

    if (keyBind == "CHARGED_BEAM") {
        return visionHeld;
    }

    if (keyBind == "BLADE") {
        return entity.getData('tmf:dyn/grey_matter_panther_timer') == 1 && !visionHeld;
    }

    if (entity.getData('tmf:dyn/grey_matter_panther_timer') == 0 && !(blockBelow_1 == "minecraft:jukebox" || blockBelow_2 == "minecraft:flower_pot")) {
        if (keyBind == "func_FROUND") {
            return !entity.isSneaking() && (gm1 || gm2);
        }
        if (keyBind == "func_-FROUND") {
            return !entity.isSneaking() && !(gm1 || gm2);
        }
        if (keyBind == "func_EQUIP_MODE") {
            return entity.isSneaking();
        }
    }

    if (keyBind == "INVISIBILITY") {
        return blockBelow_1 == "minecraft:jukebox" || blockBelow_2 == "minecraft:flower_pot";
    }

    if (keyBind == "func_PEPSI_DRINK") {
        return pepsiHeld &&  !entity.getData('tmf:dyn/p_2');
    }

    if (keyBind == "func_KINETIC_ENERGY_PULSE") {
        return entity.getData("tmf:dyn/pt_4") >= 0.375 && !entity.getData("tmf:dyn/p_4");
    }

    if (keyBind == "GREY_MATTER_BP") {
        return slot0;
    }

    return false;
}

function getDefaultScale(entity) {
    return 1 - 0.8*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return entity.getData('tmf:dyn/grey_matter_panther_timer') == 1 ? 7 : 1;
}

function pepsiDrinkKey(player, manager) {

    manager.setData(player, 'tmf:dyn/p_1', true);
    player.playSound("tmf:grey_matter.pepsi", 1, 1.0 - Math.random() * 0.1);
    return true;
}

function galvanTinkerKey(player, manager) {
        var nbt = player.getWornChestplate().nbt();	
        var equipment = nbt.getTagList("Equipment");
        //-----------------------------------
        var idWeapon = PackLoader.getNumericalItemId("fisktag:weapon");

        var itemInSlot0 = getEquipmentItemInSlot(nbt, 0);
        var itemInSlot1 = getEquipmentItemInSlot(nbt, 1);
        var itemInSlot2 = getEquipmentItemInSlot(nbt, 2);
        var itemInSlot3 = getEquipmentItemInSlot(nbt, 3);
        var itemInSlot4 = getEquipmentItemInSlot(nbt, 4);

        if (player.getWornChestplate().nbt().getString("HeroType") == "tmf:omnitrix_grey_matter") {
            if (itemInSlot1 != null && itemInSlot1.getCompoundTag('tag').getString("HeroType").contains("stellar:pepsi_man")) {
                manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 1));
                var ItemTag = manager.newCompoundTag("{Index:1, Item:{id:"+idWeapon+"s, Count:1, Damage:0 , tag:{WeaponType: tmf:pepsi}}}");
                manager.appendTag(equipment, ItemTag);
            }
            if (itemInSlot2 != null && itemInSlot2.getCompoundTag('tag').getString("HeroType").contains("stellar:pepsi_man")) {
                manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 2));
                var ItemTag = manager.newCompoundTag("{Index:2, Item:{id:"+idWeapon+"s, Count:1, Damage:0 , tag:{WeaponType: tmf:screwdriver}}}");
                manager.appendTag(equipment, ItemTag);
            }
            if (itemInSlot3 != null && itemInSlot3.getCompoundTag('tag').getString("HeroType").contains("fiskheroes:vision")) {
                manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 3));
                var ItemTag = manager.newCompoundTag("{Index:3, Item:{id:"+idWeapon+"s, Count:1, Damage:0 , tag:{WeaponType: tmf:vision_head}}}");
                manager.appendTag(equipment, ItemTag);
            }
        }
        else {
            if (itemInSlot0 != null && itemInSlot1 != null && itemInSlot2 != null && itemInSlot3 != null  && itemInSlot4 != null) {
                if (itemInSlot2.getByte("Count") >= 3 && itemInSlot3.getByte("Count") >= 4) {
                    //give modulator
                    manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 0));
                    manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 1));
                    manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 2));
                    manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 3));
                    manager.removeTag(equipment, getEquipmentSlotByIndex(nbt, 4));

                    var ItemTag = manager.newCompoundTag("{Index:4, Item:{id:"+idWeapon+"s, Count:1, Damage:0 , tag:{WeaponType: tmf:omnitrix_hack}}}");
                    manager.appendTag(equipment, ItemTag);

                    if (itemInSlot0.getByte("Count") > 1) {
                        var ItemTag = manager.newCompoundTag("{Index:0, Item:{id:"+(PackLoader.getNumericalItemId("fiskheroes:holographic_display_stand"))+"s, Count:"+ (itemInSlot0.getByte("Count")-1) +", Damage:0 }}");
                        manager.appendTag(equipment, ItemTag);
                    }
                    if (itemInSlot1.getByte("Count") > 1) {
                        var ItemTag = manager.newCompoundTag("{Index:1, Item:{id:"+(PackLoader.getNumericalItemId("fiskheroes:eternium_block"))+"s, Count:"+ (itemInSlot1.getByte("Count")-1) +", Damage:0 }}");
                        manager.appendTag(equipment, ItemTag);
                    }
                    if (itemInSlot2.getByte("Count") > 3) {
                        var ItemTag = manager.newCompoundTag("{Index:2, Item:{id:"+(PackLoader.getNumericalItemId("minecraft:repeater"))+"s, Count:"+ (itemInSlot2.getByte("Count")-3) +", Damage:0 }}");
                        manager.appendTag(equipment, ItemTag);
                    }
                    if (itemInSlot3.getByte("Count") > 4) {
                        var ItemTag = manager.newCompoundTag("{Index:3, Item:{id:"+(PackLoader.getNumericalItemId("fiskheroes:dwarf_star_alloy"))+"s, Count:"+ (itemInSlot3.getByte("Count")-4) +", Damage:0 }}");
                        manager.appendTag(equipment, ItemTag);
                    }

                }
            }
        }
        
        player.playSound("minecraft:random.anvil_break", 1, 0.9 + 0.1 * Math.random());
        return true;
}

function kineticEnergyKey(player, manager) {
    manager.setDataWithNotify(player, "tmf:dyn/p_4", true);
    manager.setDataWithNotify(player, "tmf:dyn/pi_4", 0);
    player.playSound("sabri:suit.black_panther.kinetic_energy_pulse", 1, 1.0 - Math.random() * 0.3);

    return true;
}

function hasProperty(entity, property) {
    return entity.getData('tmf:dyn/grey_matter_panther_timer') == 1 ? property == "MASK_TOGGLE" : false;
}

function getEquipmentItemInSlot(item, slot) {
    var equipment = item.getTagList("Equipment");
    for (var i = 0; i < equipment.tagCount(); ++i) {
        var entry = equipment.getCompoundTag(i);
        if (entry.getByte("Index") == slot) {
            return entry.getCompoundTag("Item");
        }
    }
    return null;
}

function getEquipmentSlotByIndex(item, slot) {
    var equipment = item.getTagList("Equipment");
    for (var i = 0; i < equipment.tagCount(); ++i) {
        var entry = equipment.getCompoundTag(i);
        if (entry.getByte("Index") == slot) {
            return i;
        }
    }
    return null;
} 
function equipmentMode(player, manager) {
    var nbt = player.getWornChestplate().nbt();	
    manager.setTagList(nbt, nbt.getString("HeroType"), nbt.getTagList("Equipment"));
    if (nbt.getString("HeroType") == "tmf:omnitrix_grey_matter") {
        manager.setString(nbt, "HeroType", "tmf:omnitrix_grey_matter_crafting");
        manager.setDataWithNotify(player, "tmf:dyn/grey_matter_crafting", true);
    }
    else {
        manager.setString(nbt, "HeroType", "tmf:omnitrix_grey_matter");
        manager.setDataWithNotify(player, "tmf:dyn/grey_matter", true);
    }
    return true;
}