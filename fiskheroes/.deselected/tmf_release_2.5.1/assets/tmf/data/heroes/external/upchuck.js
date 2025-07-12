function init(hero) {

    hero.addKeyBind("HEAT_VISION_UPCHUCK1", "Tongue-Strike", 1);

    hero.addKeyBind("UPCHUCK1", "Shoot", 1);
    hero.addKeyBind("UPCHUCK2", "Rapid-Fire", 1);
    hero.addKeyBindFunc("UPCHUCK3", upchuckBlurpKey, "Blurp, ooopsiees", 3);

    hero.addKeyBind("HEAT_VISION", "Aim", 1); 
    hero.addKeyBind("AIM", "Aim", 1);

    hero.addKeyBindFunc("func_UPCHUCK_SWITCH", upchuckSpitType, "Switch-Ability", 2);

    hero.addAttributeProfile("UPCHUCK", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 3.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 1, 0);
    });

    hero.addDamageProfile("UPCHUCK_SPIT", {
        "types": {
            "ENERGY": 0.6,
            "EXPLOSION": 1.0
        },
        "properties": {
            "ADD_KNOCKBACK": 1.5
        }
    });
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }
    manager.incrementData(entity, "tmf:dyn/pt_1", 4, entity.getData("fiskheroes:heat_vision_timer") != 0);

    var nbt = entity.getWornChestplate().nbt();
    var equipList = nbt.getTagList("Equipment");
    var itemSlot = equipList.getCompoundTag("0").getCompoundTag("Item");
    var itemCount = itemSlot.getByte("Count");

//blurp--------------
    if (entity.getData("tmf:dyn/pt_2") == 1) {
        entity.playSound("minecraft:random.explode", 1, 1.15 - Math.random() * 0.3);
        entity.playSound("tmf:upchuck.gag", 1, 1.15 - Math.random() * 0.3);
        manager.setData(entity, 'tmf:dyn/p_1', false);
        manager.setData(entity, 'tmf:dyn/pc_1', 0);
    }
    manager.incrementData(entity, "tmf:dyn/pt_2", 50, entity.getData("tmf:dyn/p_1"));
    
    if (entity.getData("tmf:dyn/p_1")) {
        if (entity.getData("tmf:dyn/pt_2") >= 0.9) {
            var list = entity.world().getEntitiesInRangeOf(entity.pos(), 10);
            for (var i = 0; i < list.size(); ++i) {
                var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "UPCHUCK_SPIT", "%1$s diet is really weird", 40*Math.pow(entity.getData("tmf:dyn/pc_1"),2), entity);
                }
            }   
        }
        manager.setData(entity, 'fiskheroes:flying', true);
    }
//------------
    if (itemCount != 0 && entity.ticksExisted() % 5 == 0 && entity.getData("tmf:dyn/pc_1") != 1) {
        if (itemCount == 1) {
            manager.setTagList(nbt, "Equipment", manager.newTagList(""))
            manager.incrementData(entity, "tmf:dyn/pc_1", 129, true);
        }
        manager.setByte(itemSlot, "Count", itemCount - 1)
        manager.incrementData(entity, "tmf:dyn/pc_1", 129, true);
    }

    if (entity.getData("fiskheroes:aiming")) {
        manager.incrementData(entity, "tmf:dyn/pc_1", entity.getData("tmf:dyn/pt_3") == 2 ? 500 : 1200, false);
    }

    if (entity.getData("fiskheroes:flying")) {
        manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
    }
    manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);

}

function getAttributeProfile(entity) {
    return "UPCHUCK";
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("upchuck");
    var timer = entity.getData("tmf:dyn/pc_1");
    var spitType = entity.getData("tmf:dyn/pt_3");

    if (modifier.id() == "upchuck_2") {
        return spitType == 1 && timer != 0;
    }
    if (modifier.id() == "upchuck_3") {
        return spitType == 2 && timer != 0;
    }
    if (modifier.id() == "upchuck_4") {
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
    }
    return true; 
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("upchuck");
    var spitType = entity.getData("tmf:dyn/pt_3");

    if (keyBind == "HEAT_VISION_UPCHUCK1") {
        return spitType == 0;
    }
    if (keyBind == "HEAT_VISION") {
        return spitType == 0;
    }

    if (keyBind == "UPCHUCK1") {
        return spitType == 1;
    }
    if (keyBind == "UPCHUCK2") {
        return spitType == 2;
    }
    if (keyBind == "UPCHUCK3") {
        return entity.getData("tmf:dyn/pc_1") >= 0.1 && SL >= 60;
    }

    if (keyBind == "func_UPCHUCK_SWITCH") {
        return SL >= 15;
    }

    return false;
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function getDefaultScale(entity) {
    return 1.0 - 0.56*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function upchuckSpitType(player, manager) {
    var spitType = player.getData("tmf:dyn/pt_3");
    var nbt = player.getWornChestplate().nbt();	
    var SL = nbt.getByte("upchuck");
    manager.setDataWithNotify(player, "tmf:dyn/pt_3", player.isSneaking() ? (spitType == 0 ? 2 : spitType - 1) : (spitType == 2 ? 0 : spitType + 1));

    return true;
}

function upchuckBlurpKey(player, manager) {
    manager.setDataWithNotify(player, "tmf:dyn/p_1", true);

    return true;
}

function canAim(entity) {
    var spitType = entity.getData("tmf:dyn/pt_3");
    return spitType == 1 || spitType == 2;
}

function getTierOverride(entity) {
    return 3;
}
