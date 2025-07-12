var sandman = implement("sabri:external/sandman_raimi");

function init(hero) {
    hero.setName("Sandman");
    hero.setVersion("Raimi");
    hero.setTier(1);
    
    hero.setChestplate("Shirt");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");
    
    hero.addPowers("sabri:sand_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBindFunc("func_TOGGLE_FIST", weaponCycleKey, "Toggle Sand Fist", 1);
    hero.addKeyBindFunc("func_TOGGLE_HAMMER", weaponCycleKey, "Toggle Sand Hammer", 1);
    hero.addKeyBindFunc("func_TOGGLE_MACE", weaponCycleKey, "Toggle Sand Mace", 1);
    hero.addKeyBind("SHADOWFORM", "Toggle Sand Cloud Form", 2);
    hero.addKeyBind("SIZE_MANIPULATION", "key.sizeManipulation", 3);
    hero.addKeyBind("CASTLE", "Castle Form", 4);
    hero.addKeyBind("SHIELD", "Castle Form", 4);
    hero.addKeyBind("SAND_TRANSFORM", "Sand Transformation", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    
    sandman.damageProfiles(hero);

    hero.addSoundEvent("HURT", "sabri:sandman_raimi_hurt");
    hero.addSoundEvent("PUNCH", ["sabri:sandman_raimi_hit_default", "sabri:sandman_raimi_hit"]);
    hero.addSoundEvent("STEP", "sabri:sandman_raimi_step");
    hero.addSoundEvent("LAND", "sabri:sandman_raimi_mud_land");

    hero.setTickHandler((entity, manager) => {
        var sand = entity.world().blockAt(entity.pos().add(0, -1, 0)).name().startsWith("minecraft:sand")

        if (entity.getData("fiskheroes:shadowform")) {
            manager.setData(entity, "fiskheroes:flying", true);
        }

        manager.incrementData(entity, "fiskheroes:dyn/giant_mode_timer", 4, entity.getData("fiskheroes:scale") > 1);

        if (!sand && entity.getData("fiskheroes:scale") > 1 && !entity.getData("fiskheroes:shadowform") || entity.isWet()) {
            manager.setData(entity, "fiskheroes:size_state", -1)
        }

        if (entity.getData("fiskheroes:shadowform") && entity.getData("sabri:dyn/drought_timer") == 0) {
            manager.setDataWithNotify(entity, "sabri:dyn/sand_cooldown", entity.getData("sabri:dyn/sand_cooldown") + 1 / 1200);
        }
        if ((sand || entity.getHeldItem().name() == "minecraft:sand") && !entity.getData("fiskheroes:shadowform")) {
            manager.setDataWithNotify(entity, "sabri:dyn/sand_cooldown", entity.getData("sabri:dyn/sand_cooldown") - 1 / 160);
        }
        manager.incrementData(entity, "sabri:dyn/sand_cooldown", 1200, entity.getData("fiskheroes:shadowform") && entity.getData("sabri:dyn/drought_timer") == 0 || entity.getData("sabri:dyn/sand"), sand || entity.getHeldItem().name() == "minecraft:sand");

        if (entity.isWet() || entity.getData("sabri:dyn/sand_cooldown") == 1) {
            manager.setData(entity, "sabri:dyn/sand", false);
        }

        manager.incrementData(entity, "sabri:dyn/fist_timer", 4, entity.getData("sabri:dyn/weapon_cycle") == 1 && entity.getData("sabri:dyn/sand_cooldown") < 1 && !entity.isWet());
        manager.incrementData(entity, "sabri:dyn/hammer_timer", 4, entity.getData("sabri:dyn/weapon_cycle") == 2 && entity.getData("sabri:dyn/sand_cooldown") < 1 && !entity.isWet());
        manager.incrementData(entity, "sabri:dyn/mace_timer", 4, entity.getData("sabri:dyn/weapon_cycle") == 3 && entity.getData("sabri:dyn/sand_cooldown") < 1 && !entity.isWet());

        if (!entity.getHeldItem().isEmpty() || entity.isWet()) {
            manager.setInterpolatedData(entity, "sabri:dyn/weapon_cycle", 0);
        }

        manager.incrementData(entity, "sabri:dyn/weapon_cycle_cooldown", 1, 1, 1);
        manager.setData(entity, "fiskheroes:blade", entity.getData("sabri:dyn/weapon_cycle") > 0);

        var water = entity.world().blockAt(entity.pos().add(0, 0, 0)).name().startsWith("minecraft:water") || entity.world().blockAt(entity.pos().add(0, 1, 0)).name().startsWith("minecraft:water")

        manager.incrementData(entity, "sabri:dyn/drought_timer", 8, 30, entity.isWet() || water);
        if (entity.getData("sabri:dyn/drought_timer") == 1) {
            manager.setData(entity, "fiskheroes:shadowform", true);
        } else if (!entity.isWet() && entity.getData("sabri:dyn/drought_timer") > 0) {
            manager.setData(entity, "fiskheroes:shadowform", false);
        }

        var nbt = entity.getWornChestplate().nbt();
        if (entity.getData("fiskheroes:scale") > 1) {
            manager.setTagList(nbt, "AttributeModifiers", manager.newTagList("[{AttributeName:\"generic.knockbackResistance\",Name:\"Knockback Resist\",Amount:1.0,Operation:0,Slot:\"chest\",UUIDMost:12345,UUIDLeast:67890}]"));
        }
        else {
            manager.removeTag(nbt, "AttributeModifiers");
        }
    });
}

function weaponCycleKey(player, manager) {
    var wc = player.getData("sabri:dyn/weapon_cycle");
    manager.setData(player, "sabri:dyn/weapon_cycle", player.isSneaking() ? wc > 0 ? wc - 1 : 3 : wc < 3 ? wc + 1 : 0);
    manager.setData(player, "sabri:dyn/weapon_cycle_cooldown", 0);

    manager.setData(player, "sabri:dyn/sand_cooldown", player.getData("sabri:dyn/sand_cooldown") + 1 / 200);

    if (wc == 0 && !player.isSneaking() || wc == 1 && player.isSneaking() || wc == 2 && player.isSneaking()) {
        player.playSound("sabri:suit.sandman_raimi.construct.fist", 1, 1.05 - Math.random() * 0.1);
    } else if (wc == 1 && !player.isSneaking() || wc == 3 && player.isSneaking()) {
        player.playSound("sabri:suit.sandman_raimi.construct.hammer", 1, 1.05 - Math.random() * 0.1);
    } else {
        player.playSound("sabri:suit.sandman_raimi.construct.mace", 1, 1.05 - Math.random() * 0.1);
    }

    return true;
}

function getTierOverride(entity) {
    return entity.getData("sabri:dyn/sand") || entity.getData("fiskheroes:scale") > 1 ? 2 : 1;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:shadowform" && modifier.name() != "fiskheroes:fire_weakness" && (entity.isWet() || entity.getData("sabri:dyn/sand_cooldown") == 1)) {
        return false;
    }

    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("fiskheroes:shadowform") && entity.getData("sabri:dyn/drought_timer") == 0;
        case "fiskheroes:shadowform":
            return entity.getData("sabri:dyn/sand_cooldown") < 1;
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var sand = entity.world().blockAt(entity.pos().add(0, -1, 0)).name().startsWith("minecraft:sand");
    var wc = entity.getData("sabri:dyn/weapon_cycle");
    var wcc = entity.getData("sabri:dyn/weapon_cycle_cooldown") == 1;
    var sc = entity.getData("fiskheroes:shadowform");
    var wet = entity.isWet();
    var cf = entity.getData("fiskheroes:shield_blocking");

    if (wet || entity.getData("sabri:dyn/sand_cooldown") == 1) {
        return false;
    }

    switch (keyBind) {
    case "func_TOGGLE_FIST":
        return entity.getHeldItem().isEmpty() && !sc && wcc && !cf && (entity.isSneaking() ? wc >= 1 && wc <= 2 : wc == 0);
    case "func_TOGGLE_HAMMER":
        return entity.getHeldItem().isEmpty() && !sc && wcc && !cf && (entity.isSneaking() ? wc == 3 : wc == 1);
    case "func_TOGGLE_MACE":
        return entity.getHeldItem().isEmpty() && !sc && wcc && !cf && (entity.isSneaking() ? wc == 0 : wc >= 2);
    case "SIZE_MANIPULATION":
        return sand && !sc && !cf && entity.getData("sabri:dyn/sand_castle_timer") == 0;
    case "CASTLE":
        return entity.getHeldItem().isEmpty() && !entity.isSneaking() && sand && !sc && entity.getData("fiskheroes:scale") == 1;
    case "SHIELD":
        return entity.getData("sabri:dyn/sand_castle_timer") >= 0.5;
    case "SHADOWFORM":
        return !cf;
    default:
        return true;
    }
}