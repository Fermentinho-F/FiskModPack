function get_item(input) {
    array = input.split(" ");
    for (var i = 0; i < array.length; i++) {
        if (array[i] == "") {
            array.splice(i, 1);
            i = i - 1;
        }
    }
    var output = [parseInt(array[0]), parseInt(array[1]), parseInt(array[2]), array[3]]
    return {
        "id": !isNaN(output[0]) && output[0] > 0 ? output[0] : 1,
        "ammount": !isNaN(output[1]) ? output[1] : 1,
        "metaData": !isNaN(output[2]) ? output[2] : 0,
        "json": typeof output[3] != "string" ? "" : output[3]
    };
}

var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Test Suit");
    hero.setTier(10);
    hero.hide()

    hero.addPrimaryEquipment("minecraft:air", false);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");

    hero.addPowers("dmh:test_power");
    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("PUNCH_DAMAGE", 50.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("JUMP_HEIGHT", 3.0, 0);
   //* hero.addAttribute("BASE_SPEED_LEVELS", 3.0, 0); *//

    hero.addKeyBindFunc("SLOT", slotChange, "Change Ability", 4)
   //* hero.addKeyBind("SIZE_MANIPULATION", "key.sizeManipulation", 3); //*
    hero.addKeyBind("CHARGED_BEAM", "key.repulsorBeams", 1);
    hero.addKeyBind("ENERGY_PROJECTION", "Energy Projection", -1);
    hero.addKeyBind("SONIC_WAVES", "Sonic Scream", 1);
    hero.addKeyBind("AIM", "key.aim", 1);
    //* hero.addKeyBind("SUPER_SPEED", "key.superSpeed", 4); *//
    hero.addKeyBind("BLADE", "key.blade", 2);
    hero.addKeyBind("SHIELD", "key.shield", 2);
    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
    hero.addKeyBind("TENTACLE_STRIKE", "key.tentacleStrike", 3);
    hero.addKeyBind("TENTACLES", "key.tentacles", 5);
    hero.addKeyBind("TRANSFORM", "Transform", 5);

    hero.addKeyBind("SHAPE_SHIFT", "Item Giver", 3);
    hero.addKeyBindFunc("GIVE_ITEM", (entity, manager) => {
        var data = entity.getData("fiskheroes:disguise");
        var item = get_item(data != null ? data : "");
        var nbt = entity.getWornChestplate().nbt();
        var info = [item["id"], item["ammount"], item["metaData"], item["json"]];
        info[3] = info[3].replace("$0", ", NeedsUnlocked:0").replace("$", "HeroType:").replace("SP", "slayerspack:").replace("UHP", "unconventional:").replace("S", "secretheroes:");
        var equipment = manager.newTagList("[{Index:0,Item:{Count:" + info[1] + ",Damage:" + info[2] + ",id:" + info[0] + ", tag:{" + info[3] + "}}}]");

        manager.setTagList(nbt, "Equipment", equipment);
        manager.setData(entity, "fiskheroes:shape_shifting_to", null);
        manager.setData(entity, "fiskheroes:shape_shift_timer", 1);
        return true;
    }, "Give Item", 3);

    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("MASK_OPEN", "fiskheroes:mk50_mask_open");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:mk50_mask_close");

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("INACTIVE", inactiveProfile);
    hero.setDamageProfile(getAttributeProfile);
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 0.7
        }
    });
    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.getData("fiskheroes:beam_charging") && !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:blade_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());


        landing.tick(entity, manager);
    });
    hero.setRuleValueModifier((entity, rule) => {
        return rule.name() == "fiskheroes:ticks_qrtimer" ? -1 : null;
    });
}

function getTierOverride(entity) {
    return entity.getData("dmh:dyn/transform") ? 8 : 0;
}

function slotChange(entity, manager) {
    var slot = entity.getData("dmh:dyn/slot");
    manager.setData(entity, "dmh:dyn/slot", (slot + 1) % 3);
    return true;
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", -2.0, 1);
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    profile.addAttribute("JUMP_HEIGHT", 1.5, 0);
    profile.addAttribute("FALL_RESISTANCE", 9.5, 0);
}

function inactiveProfile(profile) {
    profile.revokeAugments();
}

function getAttributeProfile(entity) {
    if (!entity.getData("dmh:dyn/transform")) {
        return "INACTIVE";
    }
    if (entity.getData("fiskheroes:shield_blocking")) {
        return "SHIELD";
    }
    if (entity.getData("fiskheroes:blade")) {
        return "BLADE";
    }
}

function isKeyBindEnabled(entity, keyBind) {
    var equipment = entity.getWornChestplate().nbt().getTagList("Equipment").tagCount() > 0;
    var disguise = entity.getData("fiskheroes:disguise") != null;
    var slot = entity.getData("dmh:dyn/slot");
    if (!entity.getData("dmh:dyn/transform") && keyBind != "TRANSFORM") {
        return false;
    }
    switch (keyBind) {
    case "TENTACLE_JAB":
        return entity.getData("fiskheroes:tentacles") != null;
    case "TENTACLE_GRAB":
        return entity.getData("fiskheroes:tentacles") != null;
    case "TENTACLE_STRIKE":
        return entity.getData("fiskheroes:tentacles") != null;
    case "TENTACLES":
        return !entity.isSneaking() || entity.getData("fiskheroes:mask_open_timer") > 0 && entity.getData("fiskheroes:scale") == 1;
    case "TRANSFORM":
        return (entity.isSneaking() || !entity.getData("dmh:dyn/transform")) && entity.getData("fiskheroes:mask_open_timer") == 0 && entity.getUUID() == '45e42b7f-44cf-4423-ab08-4a594bb86ba2';
    case "AIM":
        return !entity.getData("fiskheroes:tentacles") && slot == 0 && entity.getData("fiskheroes:scale") == 1;
    case "CHARGED_BEAM":
        return !entity.getData("fiskheroes:tentacles") && slot == 1 && entity.getData("fiskheroes:scale") == 1;
    case "SONIC_WAVES":
        return !entity.getData("fiskheroes:tentacles") && slot == 2 && entity.getData("fiskheroes:scale") == 1;
    case "SHIELD":
        return (entity.getData("fiskheroes:blade_timer") == 0 || entity.isBookPlayer()) && !entity.getData("fiskheroes:flying") && !entity.getData("fiskheroes:tentacles");
    case "SIZE_MANIPULATION":
        return !entity.getData("fiskheroes:tentacles")
    case "BLADE":
        return !entity.getData("fiskheroes:tentacles") && entity.getData("fiskheroes:shield_timer") > 0 || entity.getData("fiskheroes:blade_timer") > 0 || entity.isBookPlayer() || entity.getData("fiskheroes:flying");
    case "ENERGY_PROJECTION":
        return entity.getData("fiskheroes:aiming");
    case "SLOT":
        return entity.getData("fiskheroes:scale") == 1;
    case "GIVE_ITEM":
        return disguise && !equipment;
    case "SHAPE_SHIFT":
        return !disguise && !equipment;
    }
    return true;
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() != "fiskheroes:transformation" && modifier.name() != "fiskheroes:cooldown" && (!entity.getData("dmh:dyn/transform_timer") || modifier.name() == "fiskheroes:controlled_flight" && entity.getData("dmh:dyn/transform_timer") < 1)) {
        return false;
    }

    switch (modifier.name()) {
    case "fiskheroes:blade":
        return entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:aiming") && !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade")) && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    case "fiskheroes:shield":
        return entity.getData("fiskheroes:beam_charge") == 0 && !entity.getData("fiskheroes:aiming") && !(entity.getData("fiskheroes:shield") && entity.getData("fiskheroes:blade")) && !entity.getData("fiskheroes:flying");
    case "fiskheroes:controlled_flight":
        return !entity.getData("fiskheroes:tentacles")
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:shield");
}

function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.getData("dmh:dyn/transform_timer") == 1;
    default:
        return false;
    }
}
