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
    hero.setName("Amara/The Darkness");
    hero.setTier(10);

    hero.setChestplate("Dress");

    hero.addAttribute("PUNCH_DAMAGE", 20, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("IMPACT_DAMAGE", 10.0, 0);
    hero.addAttribute("MAX_HEALTH", 40, 0);

    hero.addPrimaryEquipment("minecraft:air", false);

    hero.addPowers("dmh:amara_powers", "dmh:god_phys");

    hero.addKeyBind("CHARGED_BEAM_DAMPEN", "\u00A70\u00A7lPower Negation", 1);
    hero.addKeyBind("CHARGED_BEAM", "\u00A70\u00A7lMolecular Combustion", 1);
    hero.addKeyBind("CHARGED_BEAM_VISUAL", "\u00A70\u00A7m\u00A7lMolecular Combustion", 1);

    hero.addKeyBind("TELEKINESIS", "\u00A70\u00A7lTelekinesis", 2);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A70\u00A7m\u00A7lTelekinesis", 2);

    hero.addKeyBind("ENERGY_PROJECTION", "\u00A70\u00A7lPrimordial Beam", 3);
    hero.addKeyBind("ENERGY_PROJECTION_VISUAL", "\u00A70\u00A7m\u00A7lPrimordial Beam", 3);

    hero.addKeyBind("TELEPORT", "\u00A70\u00A7lTeleport", 4);
    hero.addKeyBind("SHADOWFORM", "\u00A70\u00A7lTrue Form", 4);

    hero.addKeyBind("SHAPE_SHIFT", "\u00A70\u00A7lItem Conjuration", 5);
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
    }, "\u00A70\u00A7lConjure Item", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission((entity, permission) => permission === "MARK_OF_CAIN");
    
    hero.setDefaultScale(1.0);
    hero.setKeyBindEnabled((entity, keyBind) => {
        var equipment = entity.getWornChestplate().nbt().getTagList("Equipment").tagCount() > 0;
        var disguise = entity.getData("fiskheroes:disguise") != null;
        switch (keyBind) {
        case "SHADOWFORM":
            return entity.isSneaking();
        case "GIVE_ITEM":
            return disguise && !equipment;
        case "SHAPE_SHIFT":
            return !disguise && !equipment;
        case "TELEPORT":
            return !entity.isSneaking();
        case "CHARGED_BEAM":
            return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:shadowform");
        case "CHARGED_BEAM_DAMPEN":
            return !entity.getData("fiskheroes:telekinesis") && entity.isSneaking() && !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:shadowform");
        case "CHARGED_BEAM_VISUAL":
            return entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:energy_projection") || entity.getData("fiskheroes:shadowform");
        case "TELEKINESIS":
            return !entity.getData("fiskheroes:energy_projection") && !entity.getData("fiskheroes:shadowform");
        case "TELEKINESIS_VISUAL":
            return entity.getData("fiskheroes:energy_projection") || entity.getData("fiskheroes:shadowform");
        case "ENERGY_PROJECTION":
            return !entity.getData("fiskheroes:telekinesis") && !entity.getData("fiskheroes:shadowform");
        case "ENERGY_PROJECTION_VISUAL":
            return entity.getData("fiskheroes:telekinesis") || entity.getData("fiskheroes:shadowform");
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
        return entity.isSneaking() ? id == "power_dampen" : id == "molecular-combustion";
    case "fiskheroes:controlled_flight":
        return !entity.getData("fiskheroes:shadowform");
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:shadowform");
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