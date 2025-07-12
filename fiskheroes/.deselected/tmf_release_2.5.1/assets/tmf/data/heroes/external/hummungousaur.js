function init(hero) {

    hero.addKeyBind("SIZE_MANIPULATION", "Size Manipulation", 4);    
    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 2);
    hero.addKeyBindFunc("func_HUMMUNGOUSAUR_SPIN", hummungousaurSpin, "Tail-Whip", 1);

    hero.addAttributeProfile("HUMMUNGOUSAUR", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 8.0, 0);
        profile.addAttribute("WEAPON_DAMAGE", -2.5, 0);
        profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.85, 1);
        profile.addAttribute("KNOCKBACK", 1, 0);
        profile.addAttribute("STEP_HEIGHT", 0.75, 0);
        profile.addAttribute("MAX_HEALTH", -5, 0);

    });

    hero.addDamageProfile("HUMMUNGOUSAUR_KNOCKBACK", {
        "types": {
            "BLUNT": 1.0,
            "EXPLOSION": 0.2
        },
        "properties": {
            "ADD_KNOCKBACK": 1.0,
            "HIT_COOLDOWN": 20
          }
    });
}

function getAttributeProfile(entity) {
    return "HUMMUNGOUSAUR";
}

function tick(entity, manager, isCurrent, hero) {
    if (!isCurrent) {
        return;
    }
    var nbt = entity.getWornChestplate().nbt();    
    var SL = nbt.getByte("hummungousaur");
    if (SL < 60) {
        manager.setByte(nbt, "hummungousaur", 60);
    }

    if (entity.getData("tmf:dyn/pc_1") == 1) {
        manager.setInterpolatedData(entity, 'tmf:dyn/pc_1', 0); 
        manager.setData(entity, 'tmf:dyn/p_1', false); 
    }
    manager.incrementData(entity, "tmf:dyn/pc_1", 18, entity.getData("tmf:dyn/p_1"));
    if (entity.getData("tmf:dyn/pc_1") != 0) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 5+3*(entity.getData("fiskheroes:scale")-2.2)/7.8);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "HUMMUNGOUSAUR_KNOCKBACK", "%2$s Ankylosaurused", 7.0 + 5*(entity.getData("fiskheroes:scale")-2.2)/7.8, entity);
            }
        }
    }
    superheroLanding(entity, manager, hero)
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("hummungousaur");

    if (keyBind == "func_HUMMUNGOUSAUR_SPIN") {
        return entity.isOnGround();
    }
    if (keyBind == "GROUND_SMASH") {
        return SL >= 15;
    }
    if (keyBind == "SIZE_MANIPULATION") {
        return SL >= 60;
    }
    return false;
}

function getDefaultScale(entity) {
    return 1 + 1.2*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}

function getTierOverride(entity) {
    return 8;
}

function superheroLanding(entity, manager, hero) {
    var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");
    var superLanding = entity.getData("fiskheroes:dyn/superhero_landing_timer");
    var thing = t == 0 && !entity.isSprinting() && !entity.isOnGround();

    if (thing && entity.motionY() < (entity.isSneaking() ? - 1.0 : -1.5) && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
            manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
            entity.playSound("minecraft:random.explode", 2, 1.15 - Math.random() * 0.3);
    }
    else if (t > 0) {
        manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
    }

    manager.incrementData(entity, "tmf:dyn/pt_1", 8, 10, thing && entity.motionY() < -1 && !entity.isSneaking());
    manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 8, 10, t > 0);

    if (superLanding == 1) {
        var list = entity.world().getEntitiesInRangeOf(entity.pos(), 8);
        for (var i = 0; i < list.size(); ++i) {
            var other = list.get(i);
                if (other.isLivingEntity() && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "FOURARMS_SLAM", "%2$s got smashed", 10.0 + 10*(entity.getData("fiskheroes:scale")-2.2)/7.8, entity);
            }
        }
    }
}

function hummungousaurSpin(player, manager) {
    manager.setData(player, "tmf:dyn/p_1", true);
    player.playSound("fiskheroes:modifier.webswinging.whoosh", 1, 1.15 - Math.random() * 0.3);
    return true;
}