function init(hero) {
    
    hero.addKeyBindFunc("func_STINGER_STRIKE", stingerStrikeKey, "Stinger Strike", 1);
    hero.addKeyBindFunc("func_GOO_KEY", StinkflyGooKey, "Goo-Type", 3);

    hero.addAttributeProfile("STINKFLY", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 2.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 4.0, 0);
        profile.addAttribute("IMPACT_DAMAGE", 0.45, 1);
    });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var PT1 = entity.getData('tmf:dyn/pt_1');


    if (entity.isInWater()) {
        manager.setData(entity, 'tmf:dyn/pt_1', 400);
    }

    manager.incrementData(entity, "tmf:dyn/pt_1", 400, entity.isInWater());
    manager.incrementData(entity, "tmf:dyn/pc_1", 10, entity.isSprinting() && entity.getData('fiskheroes:flying') ? 1 : 0);

    if (isBlockInRange(entity, manager, "minecraft:lava", 2) && PT1 != 0) {
        manager.setData(entity, 'tmf:dyn/pt_1', PT1 - 0.05);
    }

    if (PT1 < 0) {
        manager.setData(entity, 'tmf:dyn/pt_1', 0);
    }

}

function getAttributeProfile(entity) {
    return "STINKFLY";
}

function StinkflyGooKey(player, manager) {
    var GooType = player.getData("fiskheroes:utility_belt_type");
    var nbt = player.getWornChestplate().nbt();	
    var SL = nbt.getByte("stinkfly");

    manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", player.isSneaking() ? -1 : (GooType == 2 ? 0 : GooType + 1));

    return true;
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("stinkfly");
    var PT1 = entity.getData('tmf:dyn/pt_1');


    if (modifier.id() == "stinkfly_1") {
        return PT1 == 0;
    }
    if (modifier.id() == "stinkfly_2") {
        return true;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("stinkfly");
    var beam = SL >= 60 && entity.getData('fiskheroes:flying');

    if (keyBind == "func_STINGER_STRIKE") {
        return beam && entity.getData('fiskheroes:beam_charge') == 0;
    }
    if (keyBind == "func_GOO_KEY") {
        return SL >= 15;
    }
    return false;
}

function getDefaultScale(entity) {
    return 1 - 0.1*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
        return 4;
}


function isBlockInRange(entity, manager, block, range) {
    for (var x = -1; Math.abs(x) <= range; x < 0 ? x=-x : x=-x-1) {
        for (var y = -1; Math.abs(y) <= range; y < 0 ? y=-y : y=-y-1) {
            for (var z = -1; Math.abs(z) <= range; z < 0 ? z=-z : z=-z-1) {
                if (entity.world().getBlock(entity.pos().add(x, y, z)) == block) {
                    manager.setData(entity, 'tmf:dyn/cX', Math.ceil(entity.posX() + x));
                    manager.setData(entity, 'tmf:dyn/cY', Math.ceil(entity.posY() + y));
                    manager.setData(entity, 'tmf:dyn/cZ', Math.ceil(entity.posZ() + z));
                    return true;
                }
            }
        }
    }
    return false;
}

function stingerStrikeKey(player, manager) {

    manager.setData(player, 'fiskheroes:beam_charging', true);

    return true;
}