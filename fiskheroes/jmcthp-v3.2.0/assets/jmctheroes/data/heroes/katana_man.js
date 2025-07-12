var frame_control = 0
var max_frame = 5

function init(hero) {
    hero.setName("Katana Man");
    hero.setAliases("katana");
    hero.setTier(7);
    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true);
    
    hero.setHelmet("Hat");
    hero.setChestplate("Trenchcoat");
    hero.setLeggings("Leggingns");
    hero.setBoots("Shoes");
    
    hero.addPowers("jmctheroes:katana");
    hero.addAttribute("FALL_RESISTANCE", 0.65, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.75, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2.2, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);
    hero.addAttribute("WEAPON_DAMAGE", 0.55, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBindFunc("FUNC_PAUSE", togglePause, "Back to Human Form", 1);
    hero.addKeyBind("_UNPAUSE", "Devil Transformation", 1);
    hero.addKeyBind("BLADE", "", 1);
    hero.addKeyBind("GUN_RELOAD", "Reload Gun", 1);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("SNEAK", sneakProfile);
    hero.addAttributeProfile("DASH", dashProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setAttributeProfile(getProfile);
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
    hero.setTickHandler((entity, manager) => {
        var dash = entity.getData("jmctheroes:dyn/dash_timer") > 0.5 && !entity.isSneaking() && entity.getData("fiskheroes:moving");
        manager.setData(entity, "fiskheroes:energy_projection", dash);
        if (entity.getData("jmctheroes:dyn/suit_animation_frame_control") < frame_control && entity.getData("jmctheroes:dyn/suit_animation_pause")) {
            manager.setData(entity, "jmctheroes:dyn/suit_animation_frame_control", entity.getData("jmctheroes:dyn/suit_animation_frame_control") + 1);
        } else if (entity.getData("jmctheroes:dyn/suit_animation_frame_control") >= frame_control || entity.getData("jmctheroes:dyn/suit_animation_pause")) {
            manager.setData(entity, "jmctheroes:dyn/suit_animation_frame_control", 0);
        };
        if (entity.getData("jmctheroes:dyn/suit_animation_frame_control") == frame_control && entity.getData("jmctheroes:dyn/suit_animation_pause")) {
            if (entity.getData("jmctheroes:dyn/suit_animation") < max_frame && entity.getData("jmctheroes:dyn/suit_animation_pause")) {
                manager.setData(entity, "jmctheroes:dyn/suit_animation", entity.getData("jmctheroes:dyn/suit_animation") + 1);
            } else if (entity.getData("jmctheroes:dyn/suit_animation") >= max_frame) {
                manager.setData(entity, "jmctheroes:dyn/suit_animation", 0);
            }
        };
    });
}
function getTierOverride(entity) {
    return entity.getData("jmctheroes:dyn/suit") ? 7 : 4;
}

function togglePause(player, manager) {
    var pause = player.getData("jmctheroes:dyn/suit_animation_pause");
    manager.setData(player, "jmctheroes:dyn/suit_animation_pause", !pause);

    return true;
}
function isKeyBindEnabled(entity, keyBind) {
    if (entity.getData("jmctheroes:dyn/suit_animation_pause") && (keyBind == "_UNPAUSE")) {
        return false
    }
    switch (keyBind) {
    case "FUNC_PAUSE":
        return entity.getHeldItem().isEmpty() && !entity.isSneaking() && (entity.getData("jmctheroes:dyn/suit_timer") == 0 || entity.getData("jmctheroes:dyn/suit_timer") == 1);
    case "_UNPAUSE":
        return entity.getHeldItem().isEmpty() && !entity.isSneaking() && (entity.getData("jmctheroes:dyn/suit_timer") == 0 || entity.getData("jmctheroes:dyn/suit_timer") == 1);
    case "BLADE":
        return entity.getHeldItem().isEmpty() && !entity.isSneaking() && (entity.getData("jmctheroes:dyn/suit_timer") == 0 || entity.getData("jmctheroes:dyn/suit_timer") == 1);
    case "GUN_RELOAD":
        return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:flight") {
        return entity.getData("jmctheroes:dyn/dash_timer") > 0.5 && !entity.isSneaking() && entity.getData("fiskheroes:moving");
    }
    return true;
}

function getProfile(entity) {
    if (entity.getData("jmctheroes:dyn/dash_timer") > 0.8 && !entity.isSneaking()) {
        return "DASH";
    }
    if (entity.getData("jmctheroes:dyn/dash_timer") > 0 && entity.isSneaking()) {
        return "SNEAK";
    }
    if (entity.getData("jmctheroes:dyn/suit")) {
        return "BLADE";
    }
}

function dashProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 2.5, 0);
    profile.addAttribute("SPRINT_SPEED", 2.0, 1);
}
function sneakProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -1.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 0.95, 1);
    profile.addAttribute("JUMP_HEIGHT", 3.5, 0);
    profile.addAttribute("PUNCH_DAMAGE", 8.7, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("WEAPON_DAMAGE", -0.45, 1);
}


