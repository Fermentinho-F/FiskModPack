function init(hero) {
    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("CHARGED_BEAM1ZSKAYR", "Beam", 1);
    hero.addKeyBind("INTANGIBILITY", "Intangibility", 2);
    hero.addKeyBind("INVISIBILITY", "Invisibility", 3);  
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 3);
    hero.addKeyBindFunc("func_ZSSKAYR", zsskayrKey, "Toggle Full Potential", 4);

    hero.addAttributeProfile("ZS_SKAYR", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("MAX_HEALTH", -3, 0);
    });
    hero.addAttributeProfile("ZS_SKAYR_FULL", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 8.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("MAX_HEALTH", -4, 0);
    });

    hero.addDamageProfile("ZS_SKAYR_LIGHT", {
        "types": {
            "LIGHT": 1.0
        },
        "properties": {
            "HEAT_TRANSFER": 400,
            "IGNITE": 2
          }
    });
}

function getAttributeProfile(entity) {
    return entity.getData('tmf:dyn/p_3') ? "ZS_SKAYR_FULL" : "ZS_SKAYR";
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }
    var nbt = entity.getWornChestplate().nbt();	
    var flight = entity.getData("fiskheroes:flying");
    var dyingToLight = nbt.getBoolean("isDay") == true && !solidAbove(entity, 250);

    if (dyingToLight && entity.ticksExisted() % 40 == 0) {
        entity.hurt(hero, "ZS_SKAYR_LIGHT", "%1$s didn't use sunscreen", 20.0);
    }
    if (!flight) {
        manager.setData(entity, 'fiskheroes:flying', true);
    }
    if (PackLoader.getSide() == "SERVER") {
        manager.setBoolean(nbt, "isDay", entity.world().isDaytime());
    }
    manager.incrementData(entity, "tmf:dyn/pt_3", 8, entity.getData('tmf:dyn/p_3'));
    manager.incrementData(entity, "tmf:dyn/pc_1", 18, entity.getData('fiskheroes:telekinesis'));
    if (entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
        manager.incrementData(entity, "tmf:dyn/pc_2", 2000, true);
    }
    if (nbt.getBoolean("isDay") == true && entity.getData('tmf:dyn/p_3')) {
        manager.setData(entity, 'tmf:dyn/p_3', false);
        entity.playSound("tmf:zsSkayr.full", 1, 0.9 + 0.2 * Math.random());
    }  
    if (entity.getData("tmf:dyn/pc_2") == 1) {
        manager.setData(entity, "tmf:dyn/timeout", true);
        manager.setData(entity, "tmf:dyn/timeout2", true);
    }
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("zs_skayr");
    var PT3 = entity.getData('tmf:dyn/pt_3');
    var intang = entity.getData('fiskheroes:intangible');
    if (modifier.id() == "zs_skayr_1") {
        return PT3 != 1;
    }
    if (modifier.id() == "zs_skayr_8") {
        return PT3 == 1;
    }
    if (modifier.id() == "zs_skayr_9") {
        return !intang;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var fullForm = entity.getData("tmf:dyn/pt_3");
    var intang = entity.getData('fiskheroes:intangible');
    var invis = entity.getData('fiskheroes:invisible');
    var charge = entity.getData('fiskheroes:beam_charge');


    if (keyBind == "func_ZSSKAYR") {
        return nbt.getBoolean("isDay") == false;
    }
    if (keyBind == "CHARGED_BEAM1ZSKAYR") {
        return !intang && !invis && fullForm == 1;
    }
    if (keyBind == "CHARGED_BEAM") {
        return !intang && !invis && fullForm == 1;
    }
    if (keyBind == "INTANGIBILITY") {
        return charge == 0;
    }
    if (keyBind == "INVISIBILITY") {
        return charge == 0 && fullForm != 1;
    }
    if (keyBind == "TELEKINESIS") {
        return charge == 0 && fullForm == 1;
    }

    return false;
}

function getDefaultScale(entity) {
    return 1 + 0.4*entity.getInterpolatedData('tmf:dyn/transformation_timer') + 0.2*entity.getInterpolatedData('tmf:dyn/pt_3');
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function getTierOverride(entity) {
    return entity.getData('tmf:dyn/p_3') ? 8 : 7;
}

function zsskayrKey(player, manager) {
    manager.setData(player, "tmf:dyn/p_3", !player.getData('tmf:dyn/p_3'));
    player.playSound("tmf:zsSkayr.full", 1, 0.9 + 0.2 * Math.random());
    return true;
}

function solidAbove(entity, distance) {
    var distance = typeof distance == "undefined" ? 16 : distance;
    for (var i=0;i<distance;i++) {
        if (entity.world().blockAt(entity.pos().add(0,i,0)).isSolid() && entity.world().blockAt(entity.pos().add(0,i,0)).name() != "minecraft:glass") {
            return true;
        }
    }
    return false;
}