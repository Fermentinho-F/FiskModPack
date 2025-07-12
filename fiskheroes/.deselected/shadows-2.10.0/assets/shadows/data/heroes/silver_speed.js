var speedster_base = implement("fiskheroes:external/speedster_base");
var suit = implement("shadows:external/return_to_random");
function init(hero) {
    hero.setName("Silver Speed");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addEquipment("fiskheroes:flash_ring");

    hero.addPowers("shadows:silver_speed");
    hero.addAttribute("PUNCH_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 4.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 16, 0);

    hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 1);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("PHASE", "Phase(Sneak Or Sprint And Jump)", 3);
    hero.addKeyBind("INTANGIBILITY", "Phase(Sneak Or Sprint And Jump)", 3);
    hero.addKeyBind("PHASE_USING", "Phase(Hold Jump Unless Sneaking)", 3);

    hero.addSoundOverrides("SPEEDTSER", speedster_base.mergeSounds("shadows:silver_speed", speedster_base.SOUNDS_COMICS));

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addAttributeProfile("JUMP", profile => {
        profile.inheritDefaults();
        profile.addAttribute("JUMP_HEIGHT", 6, 0);
    });
    hero.setAttributeProfile(entity => entity.getData('shadows:dyn/2float_interp_reset') > 0.90 ? "JUMP" : null);

    hero.setTickHandler((entity, manager) => {
        speedster_base.tick(entity, manager);
        var data1 = entity.getData("shadows:dyn/1float_interp_reset");
        var data2 = entity.getData("shadows:dyn/1boolean_reset");
        var data3 = entity.getData("shadows:dyn/1integer_reset");
        if (data2) {
            if (data3 != 5) {
                manager.setData(entity, "shadows:dyn/1integer_reset", 5);
            } else if (entity.isOnGround() && data1 == 0) {
                manager.setData(entity, "shadows:dyn/1boolean_reset", false);
            }
        } else if (!data2) {
            if (data3 > 0) {
                manager.setData(entity, "shadows:dyn/1integer_reset", data3 - 1);
            } else if (data1 == 1) {
                manager.setData(entity, "shadows:dyn/1boolean_reset", true);
            }
        }

        manager.setData(entity, "fiskheroes:energy_projection", entity.getData("fiskheroes:speeding") && entity.isSprinting());
        // charged jump
        if ((!entity.isOnGround() || entity.getData("fiskheroes:speeding") || !entity.isSneaking() && (Math.abs(entity.motionX() > 0) ||
                    Math.abs(entity.motionZ()) > 0 || entity.getData('shadows:dyn/2float_interp_reset') < 0.90)) &&
            entity.getData('shadows:dyn/2boolean_reset')) {
            manager.setData(entity, "shadows:dyn/2boolean_reset", false);
        }
        if (entity.getData("shadows:dyn/2float_interp_reset") == 0 && entity.isSneaking() && entity.isOnGround() && !entity.getData('shadows:dyn/2boolean_reset') && !entity.getData("fiskheroes:speeding")) {
            manager.setData(entity, "shadows:dyn/2boolean_reset", true);
        }
        // return to random
        suit.returnSuit(entity, manager);
    });

}

function isModifierEnabled(entity, modifier) {
    var data1 = entity.getData("shadows:dyn/1float_interp_reset");
    var data2 = entity.getData("shadows:dyn/1integer_reset");
    switch (modifier.name()) {
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:intangible") && data1 > 0 && data1 < 0.15;
    case "fiskheroes:intangibility":
        return ((data1 < 1 || entity.world().getBlock(entity.pos().add(0, -2, 0)) != "minecraft:air") || entity.isSneaking()) && data2 == 0;
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var data1 = entity.getData("shadows:dyn/1integer_reset");
    switch (keyBind) {
    case "PHASE":
        return !entity.getData("fiskheroes:intangible");
    case "PHASE_USING":
        return entity.getData("fiskheroes:intangible");
    case "INTANGIBILITY":
        return data1 == 0 && !entity.getData("fiskheroes:intangible") && (!entity.isOnGround() && !entity.isInWater() || entity.isSneaking());
    default:
        return true;
    }
}
