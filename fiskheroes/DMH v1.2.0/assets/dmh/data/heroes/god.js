var delay = 10;
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

function init(hero) {
    hero.setName("Chuck/God");
    hero.setTier(10);

    hero.setHelmet("Head");
    hero.setChestplate("Suit");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addAttribute("PUNCH_DAMAGE", 20, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("IMPACT_DAMAGE", 10.0, 0);
    hero.addAttribute("MAX_HEALTH", 20, 0);

    hero.addPrimaryEquipment("minecraft:air", false);

    hero.addPowers("dmh:god_powers", "dmh:god_phys");

    hero.addKeyBind("CHARGED_BEAM_DAMPEN", "\u00A7lPower Negation", 1);
    hero.addKeyBind("CHARGED_BEAM", "\u00A7lErase Existence", 1);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "\u00A7m\u00A7lErase Existence", 1);

    hero.addKeyBind("TELEKINESIS", "\u00A7lTelekinesis", 2);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A7m\u00A7lTelekinesis", 2);

    hero.addKeyBind("AIM", "\u00A7lPyrokinesis", 3);
    hero.addKeyBind("AIM_VISUAL", "\u00A7m\u00A7lPyrokinesis", 3);

    hero.addKeyBind("TELEPORT", "\u00A7lTeleport", 4);
    hero.addKeyBind("SIZE_MANIPULATION", "\u00A7lChange Size", 4);

    hero.addKeyBind("SHAPE_SHIFT", "\u00A7lItem Conjuration", 5);
    hero.addKeyBindFunc("GIVE_ITEM", (entity, manager) => {
        var data = entity.getData("fiskheroes:disguise");
        var item = get_item(data != null ? data : "");
        var nbt = entity.getWornChestplate().nbt();
        var info = [item["id"], item["ammount"], item["metaData"], item["json"]];
        info[3] = info[3].replace("$0", ", NeedsUnlocked:0").replace("$", "HeroType:").replace("SK:", "skarredheroes:").replace("UHP:", "unconventional:").replace("S:", "secretheroes:");
        var equipment = manager.newTagList("[{Index:0,Item:{Count:" + info[1] + ",Damage:" + info[2] + ",id:" + info[0] + ", tag:{" + info[3] + "}}}]");

        manager.setTagList(nbt, "Equipment", equipment);
        manager.setData(entity, "fiskheroes:shape_shifting_to", null);
        manager.setData(entity, "fiskheroes:shape_shift_timer", 1);
        return true;
    }, "\u00A7lConjure Item", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);

    hero.addSoundEvent("AIM_START", ["dmh:cgr/aim_on", "dmh:cgr/hellfire"]);
    hero.addSoundEvent("AIM_STOP", "dmh:cgr/aim_off");
    
    hero.setDefaultScale(1.0);
    hero.setKeyBindEnabled((entity, keyBind) => {
        var equipment = entity.getWornChestplate().nbt().getTagList("Equipment").tagCount() > 0;
        var disguise = entity.getData("fiskheroes:disguise") != null;
        switch (keyBind) {
        case "SIZE_MANIPULATION":
            return entity.isSneaking();
        case "GIVE_ITEM":
            return disguise && !equipment;
        case "SHAPE_SHIFT":
            return !disguise && !equipment;
        case "TELEPORT":
            return !entity.isSneaking();
        case "CHARGED_BEAM":
            return !entity.getData("fiskheroes:telekinesis");
        case "CHARGED_BEAM_DAMPEN":
            return !entity.getData("fiskheroes:telekinesis") && entity.isSneaking() && entity.getData("fiskheroes:scale") == 1.0;
        case "CHARGED_BEAM_VISUAL":
            return entity.getData("fiskheroes:telekinesis");
        case "TELEKINESIS":
            return entity.getData("fiskheroes:scale") == 1.0;
        case "TELEKINESIS_VISUAL":
            return entity.getData("fiskheroes:scale") > 1.0;
        case "AIM":
            return entity.getData("fiskheroes:scale") == 1.0;
        case "AIM_VISUAL":
            return entity.getData("fiskheroes:scale") > 1.0;
        default:
            return true;
        }
    });


    hero.setTickHandler((entity, manager) => {

    });

}

function isModifierEnabled(entity, modifier) {
    var id = modifier.id();
    switch (modifier.name()) {
    case "fiskheroes:charged_beam":
        return entity.isSneaking() && entity.getData("fiskheroes:scale") == 1.0 ? id == "power_dampen" : id == "erase-existence";
    case "fiskheroes:controlled_flight":
        return entity.getData("fiskheroes:scale") == 1.0;
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}