function init(hero) {
    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("CHARGED_BEAM4", "Tentacle Strike", 1);
    hero.addKeyBind("INTANGIBILITY", "Intangibility", 2);
    hero.addKeyBind("INVISIBILITY", "Invisibility", 3);  

    hero.addAttributeProfile("GHOSTFREAK", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 4.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
    });
}

function getAttributeProfile(entity) {
    return "GHOSTFREAK";
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ghostfreak");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var flight = entity.getData("fiskheroes:flying");

    if (!flight) {
        manager.setData(entity, 'fiskheroes:flying', true);
    }
    manager.incrementData(entity, "tmf:dyn/pt_1", 4, entity.getData('fiskheroes:beam_charging') && entity.getData('fiskheroes:beam_charge') >= 0.9);
    manager.incrementData(entity, "tmf:dyn/pc_1", 32, entity.getData('fiskheroes:beam_charging') && entity.getData('fiskheroes:beam_charge') >= 0.4);
    if (!entity.getData('fiskheroes:beam_charging') && entity.getData('tmf:dyn/pc_1') > 0) {
        manager.setData(entity, 'tmf:dyn/pc_1', entity.getData("tmf:dyn/pc_1") - 0.04);
    }
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ghostfreak");
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ghostfreak");
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var P2 = entity.getData('tmf:dyn/p_2');
    var flight = entity.getData("fiskheroes:flying");
    var intang = entity.getData('fiskheroes:intangible');
    var invis = entity.getData('fiskheroes:invisible');
    var charge = entity.getData('fiskheroes:beam_charge');


    if (keyBind == "CHARGED_BEAM") {
        return SL == 60 && (!intang && !invis);
    }
    if (keyBind == "CHARGED_BEAM4") {
        return SL == 60 && (!intang &&  !invis);
    }

    if (keyBind == "INTANGIBILITY") {
        return SL >= 15 && charge == 0;
    }
    if (keyBind == "INVISIBILITY") {
        return charge == 0;
    }

    return false;
}

function getDefaultScale(entity) {
    return 1 - 0.08*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";;
}

function getTierOverride(entity) {
    return 5;
}