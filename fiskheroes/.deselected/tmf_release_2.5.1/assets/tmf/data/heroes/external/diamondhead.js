function init(hero) {
    hero.addKeyBind("1SHIELD_DIAMONDHEAD", "Toggle Blades", 2);

    hero.addKeyBind("CHARGE_ICE", "Charge Shards", 1);
    hero.addKeyBind("SHIELD", "key.forcefield", 2);
    hero.addKeyBindFunc("func_DIAMOND_UPGRADE", diamondUpgradeKey, "Fuse", 3);
    hero.addKeyBindFunc("func_DIAMOND_WAVE", diamondheadWaveKey, "Push Wave", 4);

    hero.addAttributeProfile("DIAMONDHEAD", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 0.25, 0);
        profile.addAttribute("FALL_RESISTANCE", 5.5, 0);
        profile.addAttribute("MAX_HEALTH", -1, 0);
    });
    hero.addAttributeProfile("DIAMONDHEAD_SHARP", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 0.25, 0);
        profile.addAttribute("FALL_RESISTANCE", 5.5, 0);
        profile.addAttribute("MAX_HEALTH", -1, 0);
    });
    hero.addAttributeProfile("DIAMONDHEAD_CHARGE", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -10.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -1.0, 0);
        profile.addAttribute("JUMP_HEIGHT", -1000.0, 1);
        profile.addAttribute("BASE_SPEED", -1000.0, 1);
        profile.addAttribute("SPRINT_SPEED", -1000.0, 1);
        profile.addAttribute("FALL_RESISTANCE", 5.5, 0);
        profile.addAttribute("MAX_HEALTH", -1, 0);
    });

    hero.addDamageProfile("DIAMONDHEAD", {
        "types": {
            "BLUNT": 1.0,
            "SHARP": 0.75
        }
    });

    hero.addDamageProfile("DIAMONDHEAD_WAVE", {
        "types": {
            "BLUNT": 0.5,
            "SHARP": 1.0
        },
        "properties": {
            "HIT_COOLDOWN": 100
          }
    });

}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }
    
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("diamondhead");

    manager.incrementData(entity, "tmf:dyn/pc_1", 8, entity.getData('fiskheroes:shield_timer') != 0 && entity.isSneaking() && SL >= 15);
    manager.incrementData(entity, "tmf:dyn/pt_1", 8, entity.getData('fiskheroes:shield_timer') != 0 && !entity.isSneaking());

    manager.incrementData(entity, "tmf:dyn/pc_2", 28, entity.getData("tmf:dyn/p_1"));

    if (entity.getData('tmf:dyn/pc_2') == 1) {
        manager.setData(entity, "tmf:dyn/p_1", false);
    }

    if (entity.getData('tmf:dyn/pc_2') > 0.35) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 8);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
            if (other.isLivingEntity() && !entity.equals(other) && entity.world().isUnobstructed(entity.pos().add(0, 1, 0), other.pos().add(0, 1, 0))) {
                other.hurtByAttacker(hero, "DIAMONDHEAD_WAVE", "%2$s was impaled", 4.0, entity);
            }
        }
    }


}

function diamondUpgradeKey(player, manager) {
    var item = player.getHeldItem();
    var nbt = item.nbt();
    var nbt2 = player.getWornChestplate().nbt();
    var display = nbt.getCompoundTag("display");
    var lore = manager.newTagList();

    var ench = manager.newTagList();
    //manager.appendTag(ench, manager.newCompoundTag("{id:32,lvl:6}"));
    manager.appendTag(ench, manager.newCompoundTag("{id:34,lvl:4}"));
    manager.setTagList(nbt, "ench", ench);

    manager.appendString(lore, "\u00A7b\u00A7lPetrosapien Enhanced Diamond Pickaxe");
    manager.setTagList(display, "Lore", lore);
    manager.setCompoundTag(nbt, "display", display);

    manager.setBoolean(nbt, "diamondheadPickaxe", true);
    manager.setBoolean(nbt2, "diamondheadPickaxe", true);


    return true;
}

function diamondheadWaveKey(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", true);
    manager.setData(player, "fiskheroes:beam_charging", true);
    manager.setData(player, "tmf:dyn/pc_3",(wrapAngleTo180(player.rotBodyYawInterpolated())));
    player.playSound("tmf:diamondhead.wave", 1, 1);

    return true;
}


function getAttributeProfile(entity) {
    return entity.getData('tmf:dyn/pt_1') ? "DIAMONDHEAD_SHARP" : (entity.getData('tmf:dyn/pc_2') != 0 ? "DIAMONDHEAD_CHARGE" : "DIAMONDHEAD");
}

function getDamageProfile(entity) {
    return entity.getData('fiskheroes:shield') ? "DIAMONDHEAD" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("diamondhead");

    if (keyBind == "1SHIELD_DIAMONDHEAD") {
        return entity.getData('fiskheroes:beam_charge') == 0 && entity.getData('tmf:dyn/pc_2') == 0;
    }

    if (keyBind == "CHARGE_ICE") {
        return SL >= 15 && entity.getHeldItem().isEmpty() && !entity.getData('fiskheroes:shield') && entity.getData('tmf:dyn/pc_2') == 0;
    }
    if (keyBind == "SHIELD") {
        return entity.getData('fiskheroes:beam_charge') == 0 && entity.getData('tmf:dyn/pc_2') == 0;
    }
    if (keyBind == "func_DIAMOND_UPGRADE") {
        return entity.getHeldItem().name() == 'minecraft:diamond_pickaxe' && SL >= 15 && !entity.getWornChestplate().nbt().getBoolean("diamondheadPickaxe");
    }
    if (keyBind == "func_DIAMOND_WAVE") {
        return SL == 60 && entity.getData('fiskheroes:beam_charge') == 0 && !entity.getData('fiskheroes:beam_charging') && !entity.getData('fiskheroes:shield') && entity.getData('tmf:dyn/pc_2') == 0 && isBlockInRangeBelowPlayer(entity, 4);
    }

    return false;
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("diamondhead");


    if (modifier.id() == "diamondhead_8") {
        return  !entity.isSneaking();
    }

    if (modifier.id() == "diamondhead_9") {
        return  entity.isSneaking() && SL >= 15;
    }

    if (modifier.id() == "diamondhead_10") {
        return  entity.getData('tmf:dyn/p_1');
    }
    if (modifier.id() == "diamondhead_12") {
        return entity.getHeldItem().isEmpty() && !entity.getData('fiskheroes:shield') && entity.getData('tmf:dyn/pc_2') == 0;
    }
    return true;
}

function getDefaultScale(entity) {
    return 1 + 0.1*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function getTierOverride(entity) {
    return 8;
}


function wrapAngleTo180(value) {
    value %= 360;
    if (value >= 180) {
        value -= 360;
    }
    if (value < -180) {
        value += 360;
    }
    return value;
}

function isBlockInRangeBelowPlayer(entity, range) {
    for (var x = -1; Math.abs(x) <= range; x < 0 ? x=-x : x=-x-1) {
            for (var z = -1; Math.abs(z) <= range; z < 0 ? z=-z : z=-z-1) {
                if (!entity.world().blockAt(entity.pos().add(x, -1, z)).isSolid()) {
                    return false;
                }
        }
    }
    return true;
}