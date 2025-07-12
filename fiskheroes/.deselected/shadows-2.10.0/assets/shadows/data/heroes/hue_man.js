var block = implement("shadows:external/block");
var suit = implement("shadows:external/return_to_random");
var delay = 5;


function extractDest(entity) {
    return block.extractCoords(entity, String(entity.getData("fiskheroes:disguise")));
}

function canUseTeleport(entity) {
    if (entity.getData("fiskheroes:disguise") == entity.getName()) {
        return false;
    }
    return extractDest(entity).isValid();
}

function init(hero) {
    hero.setName("Hue-Man");
    hero.setTier(5);

    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");
    
    hero.addAttribute("PUNCH_DAMAGE", 2, 0);
    hero.addAttribute("JUMP_HEIGHT", 2, 0);
    hero.addAttribute("FALL_RESISTANCE", 4, 0);

    hero.addPowers("shadows:hues");

    hero.addKeyBind("ENERGY_PROJECTION", "Energy Projection", -1);
    hero.addKeyBind("AIM", "Dual Aim", 1);

    hero.addKeyBind("TELEKINESIS", "Teleport On Entity", 2);
    hero.addKeyBind("_AIM", "Teleport On Entity", 2);

    hero.addKeyBindFunc("Func_QR_TELEPORTOUT", functionQRTeleportOut, "Teleport Out of Qr Realm", 3);
    hero.addKeyBindFunc("Func_QR_TELEPORT", functionQRTeleport, "Teleport In to Qr Realm", 3);

    hero.addKeyBind("SHAPE_SHIFT", "X(Number) Y(Number) Z(Number)", 4);
    hero.addKeyBindFunc("Func_TELEPORT", functionTeleport, "Teleport", 4);
    hero.addKeyBindFunc("TELEPORT", (entity, manager) => {
        manager.setData(entity, "fiskheroes:teleport_delay", delay);
        return true;
    }, "Teleport", 4);

    hero.addKeyBindFunc("Func_SAVE", save, "Save", 5);
    hero.addKeyBindFunc("Func_LOAD", load, "Load", 5);

    hero.addKeyBind("RECALL_VISUAL", "Recharging Hues", 5);

    hero.supplyFunction("canAim", entity => entity.getHeldItem().isEmpty());

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("shadows:dyn/1integer_reset") < 85) {
            manager.setData(entity, "shadows:dyn/1integer_reset", entity.getData("shadows:dyn/1integer_reset") + 1);
        }
        
        var nbt = entity.getWornChestplate().nbt();
        // Quantum Realm travel
        if (nbt.hasKey("x") && nbt.hasKey("y") && nbt.hasKey("z") && entity.getData("shadows:dyn/1integer_reset") < 10) {
            manager.removeTag(nbt, "x");
            manager.removeTag(nbt, "y");
            manager.removeTag(nbt, "z");
        }
        if (entity.getData("shadows:dyn/1boolean_reset")) {
            if (entity.world().getDimension() == 2595) {
                manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(Math.floor(entity.posX()), Math.floor(entity.posY()), Math.floor(entity.posZ()), 0));
                manager.setData(entity, "fiskheroes:teleport_delay", 1);
            }
            if (entity.world().getDimension() == 0) {
                if (nbt.hasKey("x") && nbt.hasKey("y") && nbt.hasKey("z")) {
                    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(nbt.getInteger("x"), nbt.getInteger("y"), nbt.getInteger("z"), 0));
                } else {
                    var position = [entity.posX(), entity.posY(), entity.posZ()];
                    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(Math.floor(entity.posX()), block.safeY(entity, position).y + 1, Math.floor(entity.posZ()), 0));
                }
                manager.setData(entity, "fiskheroes:teleport_delay", 1);
                manager.setData(entity, "shadows:dyn/1boolean_reset", false);
            }
        }
        // Teleport forward (the function is mostly made by yellow)
        var item = entity.getHeldItem();
        var itemCheck = item.name() == "fiskheroes:trick_arrow" && item.stackSize() == 16 && item.damage() == 19;
        if (entity.isSneaking() && entity.getPunchTimer() == 1 && Math.ceil(Math.random() * 12) == 1 && itemCheck) {
            block.moveForward(entity, manager, Math.max(Math.ceil(Math.random() * 20), 5), Math.ceil(Math.random() * 40) != 1, delay);
        }
        // Teleport on entity
        if (entity.getData("fiskheroes:grab_id") != -1) {
            manager.setData(entity, "fiskheroes:telekinesis", false);
        }
        if (!entity.getData("shadows:dyn/2boolean_reset") && entity.getData("shadows:dyn/teleport_on_entity_timer") < 6) {
            manager.setData(entity, "shadows:dyn/teleport_on_entity_timer", entity.getData("shadows:dyn/teleport_on_entity_timer") + 0.1);
        }
        if (entity.getData("shadows:dyn/2boolean_reset") && entity.getData("shadows:dyn/teleport_on_entity_timer") != 0) {
            manager.setData(entity, "shadows:dyn/teleport_on_entity_timer", 0);
        }

        if (entity.getData("fiskheroes:grab_id") == -1 && entity.getData("shadows:dyn/teleport_on_entity") && entity.getData("shadows:dyn/teleport_on_entity_timer") > 0.5) {
            manager.setData(entity, "shadows:dyn/teleport_on_entity", false);
        }
        if (entity.getData("shadows:dyn/1float_interp_reset") == 1 && entity.getData("fiskheroes:grab_id") > -1 && !entity.getData("shadows:dyn/teleport_on_entity")) {
            var entityGrabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));

            manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(entityGrabbed.posX() - 1, entityGrabbed.posY(), entityGrabbed.posZ() - 1, entity.world().getDimension()));
            manager.setData(entity, "fiskheroes:teleport_delay", delay);

            manager.setData(entity, "shadows:dyn/teleport_on_entity", true);
        }
        // Save/Load
        if (nbt.getBoolean("recall_health_change")) {
            manager.setFloat(nbt, "recall_health_change_float", nbt.getFloat("recall_health_change_float") + 0.1);
        }
        if (nbt.getFloat("recall_health_change_float") > 2.5 && nbt.getBoolean("recall_health_change")) {
            manager.setBoolean(nbt, "recall_health_change", false);
        }
        if (nbt.getBoolean("recall") && nbt.getFloat("recall_float") < 0.2) {
            manager.setFloat(nbt, "recall_float", nbt.getFloat("recall_float") + 0.1);
        }
        if (!nbt.getBoolean("recall") && nbt.getFloat("recall_float") > 0) {
            manager.setFloat(nbt, "recall_float", nbt.getFloat("recall_float") - 0.1);
        }
        if (entity.getData("shadows:dyn/4boolean_reset") && entity.getData("shadows:dyn/3float_interp_reset") == 1) {
            manager.setData(entity, "shadows:dyn/3float_interp_reset", 0);
            manager.setData(entity, "shadows:dyn/4boolean_reset", false);
        }
        // return to random
        suit.returnSuit(entity, manager);
        // x/y/z/dim teleport
        if (entity.getData("shadows:dyn/5boolean_reset")) {
            var dest = JSON.parse(entity.getData("shadows:dyn/1string_reset"));
            if (dest[3] !== entity.world().getDimension()) {
                dest[1] = block.safeY(entity, dest).y;
                manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(dest[0], dest[1], dest[2], entity.world().getDimension()));
                manager.setData(entity, "fiskheroes:teleport_delay", 1);
                manager.setData(entity, "shadows:dyn/5boolean_reset", false);
            }
        }  
    });

    for (var i = 19; i > 0; i--) { // Save/Load
        hero.addAttributeProfile(String(i), profile => {
            profile.inheritDefaults();
            profile.addAttribute("MAX_HEALTH", i - 20, 0);
        });
    }
    hero.setAttributeProfile(entity => { // Save/Load
        var nbt = entity.getWornChestplate().nbt();
        var i = nbt.getDouble("recall_health");
        return nbt.getBoolean("recall_health_change") && i < 20 ? String(i) : null;
    });
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);


}

function functionTeleport(entity, manager) { // x/y/z/dim teleport
    var dest = extractDest(entity);
    var dim = dest.dim == 0 ? entity.world().getDimension() : 1;
    manager.setData(entity, "shadows:dyn/5boolean_reset", dest.dim == 1);
    var position = [dest.x, dest.dim == 0 ? block.safeY(entity, [dest.x, dest.y, dest.z]).y : dest.y, dest.z, entity.world().getDimension()];
    manager.setData(entity, "shadows:dyn/1string_reset", JSON.stringify(position));
    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(position[0], position[1], position[2], dim));
    manager.setData(entity, "fiskheroes:teleport_delay", delay);
    manager.setData(entity, "fiskheroes:disguise", "");
    return true;
}

function functionQRTeleportOut(entity, manager) { // Quantum Realm travel
    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(Math.floor(entity.posX()), Math.floor(entity.posY()), Math.floor(entity.posZ()), 1));
    manager.setData(entity, "fiskheroes:teleport_delay", delay);
    manager.setData(entity, "fiskheroes:scale", 1);
    manager.setData(entity, "fiskheroes:qr_timer", 0);
    manager.setData(entity, "shadows:dyn/1boolean_reset", true);
    return true;
}

function functionQRTeleport(entity, manager) { // Quantum Realm travel
    var nbt = entity.getWornChestplate().nbt();
    manager.setInteger(nbt, "x", Math.floor(entity.posX()));
    manager.setInteger(nbt, "y", Math.floor(entity.posY()));
    manager.setInteger(nbt, "z", Math.floor(entity.posZ()));
    manager.setData(entity, "fiskheroes:qr_timer", 1);
    manager.setData(entity, "fiskheroes:scale", 0);
    return true;
}

function save(entity, manager) { // Save/Load
    var nbt = entity.getWornChestplate().nbt();
    manager.setInteger(nbt, "recall_dim", entity.world().getDimension());
    manager.setDouble(nbt, "recall_health", Math.round(entity.getHealth()));
    manager.setFloat(nbt, "recall_posx", entity.posX());
    manager.setFloat(nbt, "recall_posy", entity.posY() + 1);
    manager.setFloat(nbt, "recall_posz", entity.posZ());
    manager.setBoolean(nbt, "recall", true);

    var nbt = entity.getWornChestplate().nbt();
    var lore = manager.newCompoundTag("{Lore:[" + "\u00A76X " + String(Math.floor(entity.posX())) + "," + "\u00A76Y " + String(Math.floor(entity.posY())) + "," + "\u00A76Z " + String(Math.floor(entity.posZ())) + "," + "\u00A76Health " + String(Math.round(entity.getHealth())) + "]}");
    manager.setCompoundTag(nbt, "display", lore);
    return true;
}
function load(entity, manager) { // Save/Load
    manager.setData(entity, "shadows:dyn/3boolean_reset", false);
    var nbt = entity.getWornChestplate().nbt();
    var RecallX = Math.floor(nbt.getFloat("recall_posx"));
    var RecallY = Math.floor(nbt.getFloat("recall_posy"));
    var RecallZ = Math.floor(nbt.getFloat("recall_posz"));

    manager.setData(entity, "fiskheroes:teleport_dest", manager.newCoords(RecallX, RecallY, RecallZ, entity.world().getDimension()));
    manager.setData(entity, "fiskheroes:teleport_delay", delay);
    manager.setBoolean(nbt, "recall_health_change", true);
    manager.setFloat(nbt, "recall_health_change_float", 0);
    manager.setData(entity, "shadows:dyn/recall_cooldown", 1);
    manager.setBoolean(nbt, "recall", false);

    manager.removeTag(nbt, "display");
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();
    var creative = nbt.getByte("NeedsUnlock") == 0;
    var raycast = block.raycast(entity, 14) != null;
    var check = entity.isSneaking() && raycast;
    var valid = extractDest(entity).isValid()
    if (entity.getData("fiskheroes:aiming_timer") == 1 && keyBind != "AIM" && keyBind != "ENERGY_PROJECTION") {
        return false;
    }
    if (entity.getData("shadows:dyn/recall_cooldown") > 0) {
        return keyBind == "RECALL_VISUAL";
    }
    switch (keyBind) {
    case "SHAPE_SHIFT": // x/y/z/dim teleport
        return !valid && creative && !check;
    case "Func_TELEPORT":
        return valid && creative && !check;
    case "TELEPORT":
        return !creative && raycast || check;
    case "Func_QR_TELEPORT": // Quantum Realm travel
        return entity.world().getDimension() != 2594;
    case "Func_QR_TELEPORTOUT":
        return entity.world().getDimension() == 2594;
    case "_AIM": // Teleport on entity
        return !entity.getData("shadows:dyn/teleport_on_entity") && entity.getData("fiskheroes:grab_id") != -1;
    case "TELEKINESIS":
        return !entity.getData("shadows:dyn/teleport_on_entity");
    case "Func_LOAD": // Save/Load
        return nbt.getInteger("recall_dim") == entity.world().getDimension() && nbt.getFloat("recall_float") >= 0.2;
    case "Func_SAVE":
        return nbt.getFloat("recall_float") <= 0;
    case "RECALL_VISUAL":
        return entity.getData("shadows:dyn/recall_cooldown") > 0;
    case "ENERGY_PROJECTION": // Energy projection/Replsor
        return entity.getData("fiskheroes:aiming_timer") == 1;
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();
    switch (modifier.name()) {
    case "fiskheroes:healing_factor": // Save/Load
        return nbt.getBoolean("recall_health_change");
    case "fiskheroes:telekinesis": // Teleport on entity
        return !entity.getData("shadows:dyn/teleport_on_entity");
    case "fiskheroes:repulsor_blast": // Energy projection/Replsor
        return !entity.getData("fiskheroes:energy_projection");
    default:
        return true;
    }
}
