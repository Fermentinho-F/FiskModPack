function init(hero) {
    hero.addKeyBind("SWAMPFIRE_AIM", "Ranged Methane Combustion", 1); 

    hero.addKeyBind("HEAT_VISION", "Aim", 1); 
    hero.addKeyBindFunc("func_SWAMPFIRE_GAS", swampfireGas, "Explosive Gas", 3);

    hero.addAttributeProfile("SWAMPFIRE", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("KNOCKBACK", 0.25, 0);
    });
    hero.addAttributeProfile("SWAMPFIRE_STATIC", profile => {
        profile.addAttribute("PUNCH_DAMAGE",3.5, 0);
        profile.addAttribute("JUMP_HEIGHT", -10.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
        profile.addAttribute("SPRINT_SPEED", -1.0, 1);
        profile.addAttribute("BASE_SPEED", -1.0, 1);
    });
}

function getAttributeProfile(entity) {
    return entity.getData("tmf:dyn/pc_1") != 0 ? "SWAMPFIRE_STATIC" : "SWAMPFIRE";
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }
    var nbt = entity.getWornChestplate().nbt();    
    var SL = nbt.getByte("swampfire");
    if (SL < 60) {
        manager.setByte(nbt, "swampfire", 60);
    }

    manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, 80, entity.getData("fiskheroes:flying"));

    if (entity.getData("tmf:dyn/pc_1") == 1) {
        entity.playSound("minecraft:random.explode", 0.7, 1.15 - Math.random() * 0.3);
        entity.playSound("fiskheroes:suit.firestorm.flight.enable", 1.2, 1.15 - Math.random() * 0.3);
        manager.setData(entity, 'tmf:dyn/p_1', false); 
    }
    manager.incrementData(entity, "tmf:dyn/pc_1", 40, 20, entity.getData("tmf:dyn/p_1"));
    if (entity.getData("tmf:dyn/pc_1") != 0 && entity.getData("tmf:dyn/pc_1") >= 0.2 && !entity.getData("tmf:dyn/p_1")) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 5);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "FLAME_PUNCH", "%2$s bottom got smoked", 5.5, entity);
            }
        }
    }
    superheroLanding(entity, manager)
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	

    if (modifier.id() == "swampfire_2") {
        return !entity.isWet();
    }
    if (modifier.id() == "swampfire_3") {
        return entity.isWet();
    }
    if (modifier.id() == "swampfire_10") {
        return entity.getData("tmf:dyn/pc_1") == 0 && !entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:heat_vision");
    }
    if (modifier.id() == "swampfire_12") {
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") != 1;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    if (keyBind == "SWAMPFIRE_AIM") {
        return !entity.getData("fiskheroes:flying") && entity.getData("tmf:dyn/pc_1") == 0;
    }
    if (keyBind == "HEAT_VISION") {
        return !entity.getData("fiskheroes:flying") && entity.getData("tmf:dyn/pc_1") == 0;
    }

    if (keyBind == "func_SWAMPFIRE_GAS") {
        return entity.isOnGround() && !entity.getData("fiskheroes:flying");
    }

    return false;
}

function getDefaultScale(entity) {
    return 1 + 0.3*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 7;
}

function superheroLanding(entity, manager) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.25 && entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
        manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }
    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
}

function swampfireGas(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", true);
    player.playSound("fiskheroes:entity.smokebomb.fizz", 1, 1.15 - Math.random() * 0.3);
    return true;
}