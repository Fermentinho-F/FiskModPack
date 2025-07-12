var block = implement("shadows:external/block");
var count = 4;
function bblood(entity, manager, set) {
    var nbt = entity.getWornHelmet().nbt();
    var set = set == undefined ? 0 : set;
    if (manager == undefined) {
        return nbt.getFloat("blood");
    } else if (PackLoader.getSide() == "SERVER") {
        manager.setFloat(nbt, "blood", set)
    }
    return;
}
function biting(entity) {
    return entity.getData("shadows:dyn/3boolean_reset") && entity.getData("shadows:dyn/1float_interp_reset") > 0;
}
function inSun(entity, check) {
    var check = check == undefined ? false : check;
    return entity.getWornHelmet().nbt().getBoolean("isDay") && !block.solidAbove(entity) && (bblood(entity) <= 0.5 || check);
}
function prev_transform(entity, type) {
    return entity.getData("fiskheroes:scale") != 1 && entity.getData("shadows:dyn/1string_reset") == type;
}

function init(hero) {
    hero.setName("Vampire");
    hero.setTier(8);

    hero.setHelmet("Mask");

    hero.addPowers("shadows:vampire");

    hero.addPrimaryEquipment("minecraft:beef", false, item => item.stackSize() >= count);
    hero.addPrimaryEquipment("minecraft:porkchop", false, item => item.stackSize() >= count);
    hero.addPrimaryEquipment("minecraft:chicken@1", false, item => item.stackSize() >= count);
    hero.addPrimaryEquipment("minecraft:fish", false, item => item.stackSize() >= count);
    hero.addPrimaryEquipment("minecraft:fish@1", false, item => item.stackSize() >= count);

    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("JUMP_HEIGHT", 5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 8, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2, 1);
    hero.addAttribute("BASE_SPEED", 0.4, 1);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("STEP_HEIGHT", 1, 0);

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);

    hero.addKeyBindFunc("WOLF", (entity, manager) => {
        manager.setData(entity, "shadows:dyn/2boolean_reset", !entity.getData("shadows:dyn/2boolean_reset"));
        manager.setData(entity, "fiskheroes:size_state", entity.getData("shadows:dyn/2boolean_reset") ? -1 : 1);
        manager.setData(entity, "shadows:dyn/1string_reset", "wolf");
        return true;
    }, "Wolf", 1);
    hero.addKeyBind("TELEKINESIS", "Grab(Bite)", 2);
    hero.addKeyBind("AIM", "Grab(Bite)", 2);

    hero.addKeyBindFunc("DRINK", (entity, manager) => {
        var nbt = entity.getWornHelmet().nbt();
        var equipment = nbt.getTagList("Equipment");
        var blood = bblood(entity);
        if (equipment.tagCount() && blood < 0.95) {
            var choose = equipment.getCompoundTag(0).getCompoundTag("Item");
            var deleteItems = 0;
            for (var i = 0; i < Math.round(choose.getInteger("Count") / count) && blood < 0.95; i++) {
                blood += 0.06;
                deleteItems += count;
            }
            bblood(entity, manager, Math.min(blood, 1));
            var deleting = choose.getInteger("Count") - deleteItems;
            if (deleting > 0)
                manager.setInteger(choose, "Count", deleting);
            else
                manager.removeTag(equipment, 0);
        }
        return true;
    }, "Drink Blood(From Equipment Wheel)", 2);

    hero.addKeyBindFunc("COLOR", (entity, manager) => {
        var item = entity.getHeldItem();
        if (item.name() == "minecraft:dye") {
            manager.setByte(entity.getWornHelmet().nbt(), "color", (item.damage() + 1) % 17);
            return true;
        }
        manager.setByte(entity.getWornHelmet().nbt(), "color", 0);
        return true;
    }, "Change Color(Hold Dye)", 2);

    hero.addKeyBindFunc("RGB", (entity, manager) => {
        var nbt = entity.getWornHelmet().nbt();
        manager.setBoolean(nbt, "rgb", !nbt.getBoolean("rgb"));
        return true;
    }, "RGB", 3);

    hero.addKeyBind("CHARGED_BEAM", "Bat Slam", 3);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "Bat Slam", 3);

    hero.addKeyBind("SHADOWS", "Shadows", 4);

    hero.addKeyBind("HOVER", "Levitate", 5);

    hero.setAttributeProfile(getAttributeProfile);
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setRuleValueModifier(getRuleValueModifier);
    hero.supplyFunction("canAim", canAim);

    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");

    hero.addSoundEvent("STEP", "shadows:vampire/wolf_step");

    hero.setTickHandler((entity, manager) => {
        var nbt = entity.getWornHelmet().nbt();
        if (PackLoader.getSide() == "SERVER") {
            manager.setBoolean(nbt, "isDay", entity.world().isDaytime());
        }
        //Blood

        var use = (condition, amount) => {
            if (condition) {
                bblood(entity, manager, Math.max(bblood(entity) - amount, 0));
            }
        };


        var ray = block.raycast(entity, 6);
        var lookingAtDisplay = ray != null ? ray.name == "fiskheroes:display_stand_top" || ray.name == "fiskheroes:display_stand" || ray.name == "fiskheroes:holographic_display_stand" : false;
        var condition = !entity.getData('shadows:dyn/3boolean_reset') && entity.getData('shadows:dyn/1float_interp_reset') > 0.8;
        if (bblood(entity) > 0 && !condition && !lookingAtDisplay && !entity.getHeldItem().name() != "minecraft:dye") {
            bblood(entity, manager, Math.min(bblood(entity) + 1 / 30000, 1));
        }

        use(entity.getData("fiskheroes:beam_charging") && entity.getData("fiskheroes:beam_charge") == 0, 0.3);
        use(entity.getData("shadows:dyn/4boolean_reset") && entity.getData("shadows:dyn/2float_reset") == 0, 0.2);
        use(entity.getData("fiskheroes:hovering") && entity.getData("shadows:dyn/2float_interp_reset") < 0.21, 0.1);

        // Bat Form
        if ((entity.getData("fiskheroes:flying") != entity.getData("shadows:dyn/1boolean_reset"))) {
            manager.setData(entity, "fiskheroes:size_state", entity.getData("fiskheroes:flying") ? -1 : 1);
            manager.setData(entity, "shadows:dyn/1string_reset", "bat");
            manager.setData(entity, "shadows:dyn/1boolean_reset", entity.getData("fiskheroes:flying"));
        }

        // Wolf Form
        if (entity.getData("shadows:dyn/2boolean_reset") && (!entity.getHeldItem().isEmpty() || inSun(entity))) {
            manager.setData(entity, "fiskheroes:size_state", 1);
            manager.setData(entity, "shadows:dyn/2boolean_reset", false);
        }
        // Wolf/Bat Sound
        if (entity.getData("fiskheroes:scale") != 1 || entity.getData('fiskheroes:beam_charge') > 0.5 && entity.getData('fiskheroes:beam_charging')) {
            manager.setData(entity, "shadows:dyn/1integer_reset", (entity.getData("shadows:dyn/1integer_reset") + 1) % 100);
        } else if (entity.getData("shadows:dyn/1integer_reset") != 0) {
            manager.setData(entity, "shadows:dyn/1integer_reset", 0);
        }

        if (prev_transform(entity, "bat") && entity.getData("shadows:dyn/1integer_reset") == 0 || entity.getData('fiskheroes:beam_charge') > 0.5 && entity.getData('fiskheroes:beam_charging') && entity.getData("shadows:dyn/1integer_reset") % 10 == 0) {
            entity.playSound("shadows:vampire.bat.idle", 0.1, 1);
        }
        if (prev_transform(entity, "wolf") && entity.getData("shadows:dyn/1integer_reset") == 0) {
            if (Math.floor(Math.random() * 5) == 0) {
                entity.playSound("shadows:vampire.wolf.panting", 0.2, 1);
            } else {
                entity.playSound("shadows:vampire.wolf.bark", 0.2, 1);
            }
        }
        //Bite
        if ((entity.getData("shadows:dyn/3boolean_reset") != entity.getData("fiskheroes:grab_id") > -1) && (entity.getData("shadows:dyn/1float_interp_reset") == 0 && !entity.getData("shadows:dyn/3boolean_reset") || entity.getData("shadows:dyn/3boolean_reset"))) {

            manager.setData(entity, "shadows:dyn/3boolean_reset", entity.getData("fiskheroes:grab_id") > -1);
        }
        if (entity.getData("fiskheroes:grab_id") > -1) {
            manager.setData(entity, "fiskheroes:grab_distance", 2);
            var target = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
            if (target.isUndead()) {
                manager.setData(entity, "shadows:dyn/3boolean_reset", false);
            }
        }
        manager.incrementData(entity, "shadows:dyn/1float_interp_reset", 40, 80, entity.getData("shadows:dyn/3boolean_reset"));
        if (entity.getData("shadows:dyn/3boolean_reset") && entity.getData("shadows:dyn/1float_interp_reset") == 1) {
            bblood(entity, manager, Math.min(bblood(entity) + 0.4, 1));
            var target = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
            target.hurtByAttacker(hero, "BITE", "%s got bitten by %s", 10.0, entity);
            entity.hurt(hero, "SATURATION", "%s died by feeding", 0.000001);
            entity.playSound("shadows:vampire.bite1", 0.5, 1 + (Math.random() * 0.2));
            manager.setData(entity, "shadows:dyn/3boolean_reset", false);
        }
        // Disable Pickup
        var noPickup = entity.getData("shadows:dyn/1boolean_reset") || entity.getData("shadows:dyn/2boolean_reset") || entity.getData("fiskheroes:grab_id") > -1 || entity.getData("shadows:dyn/4boolean_reset");
        if (entity.getData("fiskheroes:punchmode") != noPickup) {
            manager.setData(entity, "fiskheroes:punchmode", noPickup);
        }
        // Reset Heat Vision Length
        if (entity.getData("fiskheroes:beam_charge") < 0.8 && entity.getData("fiskheroes:heat_vision_length") != 0) {
            manager.setData(entity, "fiskheroes:heat_vision_length", 0);
        }
        // Shield
        if (entity.getData("shadows:dyn/4boolean_reset") && (entity.getData("shadows:dyn/1float_reset") > 0 || entity.getData("shadows:dyn/1boolean_reset") || entity.getData("fiskheroes:beam_charging"))) {
            manager.setData(entity, "shadows:dyn/4boolean_reset", false);
        }
        if (entity.getData("fiskheroes:shield") != entity.getData("shadows:dyn/4boolean_reset")) {
            manager.setData(entity, "fiskheroes:shield", entity.getData("shadows:dyn/4boolean_reset"));
            manager.setData(entity, "fiskheroes:shield_blocking", entity.getData("shadows:dyn/4boolean_reset"));
        }
        // Hover
        manager.incrementData(entity, "shadows:dyn/2float_interp_reset", 5, entity.getData("fiskheroes:hovering"));
        // Shadows
        if ((entity.getData("shadows:dyn/4boolean_reset") && !inSun(entity, true) && entity.getHeldItem().isEmpty()) != entity.getData("fiskheroes:invisible")) {
            manager.setData(entity, "fiskheroes:invisible", !entity.getData("fiskheroes:invisible"));
        }
    });

    hero.addDamageProfile("HOLY", {
        "types": {
            "HOLY": 1.0
        },
        "properties": {
          "REDUCE_KNOCKBACK": 1
        }
    });
    
    hero.addAttributeProfile("NOTHING", profile => {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -1, 1);
        profile.addAttribute("SPRINT_SPEED", -1, 1);
        profile.addAttribute("JUMP_HEIGHT", -10, 1);
        profile.addAttribute("PUNCH_DAMAGE", -10, 1);
        profile.addAttribute("WEAPON_DAMAGE", -10, 1);
    });
    hero.addAttributeProfile("WOLF", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 1.3, 1);
        profile.addAttribute("JUMP_HEIGHT", 1, 1);
        profile.addAttribute("PUNCH_DAMAGE", 6, 0);
        profile.addAttribute("WEAPON_DAMAGE", -10, 1);
    });
    hero.addAttributeProfile("SHADOWS", profile => {
        profile.inheritDefaults();
        profile.addAttribute("SPRINT_SPEED", 1, 1);
        profile.addAttribute("JUMP_HEIGHT", 6, 0);
        profile.addAttribute("PUNCH_DAMAGE", 10, 0);
        profile.addAttribute("WEAPON_DAMAGE", 4, 1);
    });
    hero.addAttributeProfile("SUN", profile => {
        profile.revokeAugments()
        profile.addAttribute("FALL_RESISTANCE", 1, 1);
        profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
        profile.addAttribute("PUNCH_DAMAGE", 2, 0);
        profile.addAttribute("BASE_SPEED", -0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0.3, 1);
        profile.addAttribute("STEP_HEIGHT", 1, 0);
    });
    hero.addAttributeProfile("WEAKER", profile => {
        profile.revokeAugments()
        profile.addAttribute("FALL_RESISTANCE", 1, 1);
        profile.addAttribute("JUMP_HEIGHT", 1, 0);
        profile.addAttribute("PUNCH_DAMAGE", 3, 0);
        profile.addAttribute("SPRINT_SPEED", 0.4, 1);
        profile.addAttribute("STEP_HEIGHT", 1, 0);
    });

    hero.addDamageProfile("BITE", {
        "types": {
            "MAGIC": 2.0,
            "SHARP": 5.0
        }
    });
    hero.addDamageProfile("SATURATION", {
        "properties": {
          "EFFECTS": [{
              "id": "minecraft:saturation",
              "duration": 2,
              "amplifier": 1
            }
          ]
        }
    });
    hero.setDamageProfile(entity => null);
}

function getAttributeProfile(entity) {
    switch (true) {
    case entity.getData("fiskheroes:beam_charging") || entity.getData("fiskheroes:grab_id") != -1:
        return "NOTHING";
    case entity.getData("shadows:dyn/2boolean_reset"):
        return "WOLF";
    case entity.getData("shadows:dyn/4boolean_reset"):
        return "SHADOWS";
    case inSun(entity):
        return "SUN";
    case inSun(entity, true):
        return "WEAKER";
    default:
        return null;
    }
}
function getTierOverride(entity) {
    return inSun(entity) ? 7 : 8;
}
function isModifierEnabled(entity, modifier) {
    if (inSun(entity) && modifier.name() != "fiskheroes:telekinesis" && modifier.name() != "fiskheroes:heat_vision" && modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:charged_beam" && entity.as("DISPLAY").getDisplayType() != "BOOK_PREVIEW") {
        if ((modifier.name() == "fiskheroes:hover" || modifier.name() == "fiskheroes:flight") && entity.getData("fiskheroes:hovering") || entity.getData("shadows:dyn/4boolean_reset") && (modifier.name() == "fiskheroes:frost_walking" || modifier.name() == "fiskheroes:shield")) {
            return true;
        }
        return false;
    }
    var wolf_form = entity.getData("shadows:dyn/1float_reset") > 0 || entity.getData("shadows:dyn/2boolean_reset");
    var blood = bblood(entity);
    var id = modifier.id();
    switch (modifier.name()) {
    case "fiskheroes:size_manipulation":
        return wolf_form ? modifier.id() == "wolf_form_size" : modifier.id() == "bat_form_size";
    case "fiskheroes:controlled_flight":
        return !wolf_form && entity.getHeldItem().isEmpty();
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:hovering") || entity.getData("fiskheroes:shadowform");
    case "fiskheroes:hover":
        return !wolf_form && !entity.getData("shadows:dyn/1boolean_reset") && !entity.getData("shadows:dyn/4boolean_reset");
    case "fiskheroes:frost_walking":
        return entity.getData("shadows:dyn/4boolean_reset") && !entity.getHeldItem().isEmpty();
    case "fiskheroes:shield":
    case "fiskheroes:charged_punch":
        return entity.as("DISPLAY").getDisplayType() != "BOOK_PREVIEW";
    case "fiskheroes:damage_weakness":
        return !id.startsWith("HOLY") || (blood > 0.6 ? id == "HOLY_LESSER" : id == "HOLY");
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    if (inSun(entity) && keyBind != "COLOR" && keyBind != "RGB" && keyBind != "TELEKINESIS" && keyBind != "AIM" && keyBind != "DISABLE_PUNCH" && keyBind != "DRINK") {
        if (entity.getData("fiskheroes:hovering") && keyBind == "HOVER" || entity.getData("shadows:dyn/4boolean_reset") && keyBind == "SHADOWS") {
            return true;
        }
        return false;
    }
    if (biting(entity) && keyBind != "TELEKINESIS" && keyBind != "AIM" && keyBind != "DISABLE_PUNCH" || entity.getData("shadows:dyn/1boolean_reset") || prev_transform(entity, "bat") || (entity.getData("shadows:dyn/1float_reset") > 0 || prev_transform(entity, "bat")) && keyBind != "WOLF" || entity.getData("shadows:dyn/4boolean_reset") && keyBind != "SHADOWS") {
        return false;
    }
    var bite = (!entity.getData("shadows:dyn/3boolean_reset") && entity.getData("shadows:dyn/1float_interp_reset") == 0 || entity.getData("shadows:dyn/3boolean_reset") || entity.getData("shadows:dyn/1float_interp_reset") == 1) && entity.getHeldItem().isEmpty();
    var blood = bblood(entity);
    switch (keyBind) {
    case "TELEKINESIS":
    case "AIM":
        return !entity.isSneaking() && bite && !entity.getData("fiskheroes:mask_open") && entity.getData('fiskheroes:beam_charge') == 0;
    case "DISABLE_PUNCH":
        return entity.getData("fiskheroes:grab_id") > -1;
    case "DRINK":
        return (!bite || entity.isSneaking()) && !entity.getData("fiskheroes:mask_open");
    case "COLOR":
        return entity.getData("fiskheroes:mask_open");
    case "RGB":
        return entity.getData("fiskheroes:mask_open");
    case "WOLF":
        return entity.getHeldItem().isEmpty() && entity.getData('fiskheroes:beam_charge') == 0;
    case "CHARGED_BEAM":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("fiskheroes:grab_id") == -1 && entity.getData('fiskheroes:beam_charge') == 0 && !entity.getData("fiskheroes:mask_open") && blood > 0.5;
    case "CHARGED_BEAM_VISUAL":
        return !entity.getData("fiskheroes:mask_open") && entity.getData("fiskheroes:grab_id") == -1 && blood > 0.5;
    case "SHADOWS":
        return entity.getData("fiskheroes:grab_id") == -1 && entity.getData('fiskheroes:beam_charge') == 0 && (blood > 0.3 || entity.getData("shadows:dyn/4boolean_reset"));
    case "HOVER":
        return blood > 0.2 || entity.getData("fiskheroes:hovering");
    default:
        return true;
    }
}

function getRuleValueModifier(entity, rule) {
    return rule.name() == "fiskheroes:ticks_qrtimer" ? -1 : null;
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:grab_id") > -1;
}