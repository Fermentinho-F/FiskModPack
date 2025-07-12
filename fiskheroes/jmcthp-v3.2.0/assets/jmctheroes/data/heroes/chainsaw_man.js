var frame_control = 0
var max_frame = 5

function init(hero) {
    hero.setName("Chainsaw Man");
    hero.setAliases("denji");
    hero.setTier(6);
    hero.addPrimaryEquipment("minecraft:iron_axe", true);
    
    hero.setHelmet("Chainsaw Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Leggingns");
    hero.setBoots("Shoes");
    
    hero.addPowers("jmctheroes:pochita");
    hero.addAttribute("FALL_RESISTANCE", 0.45, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("WEAPON_DAMAGE", 0.5, 1);

    hero.addKeyBindFunc("FUNC_PAUSE", togglePause, "Back to Human Form", 1);
    hero.addKeyBind("_UNPAUSE", "Devil Transformation", 1);
    hero.addKeyBind("BLADE", "", 1);

    hero.addSoundEvent("PUNCH", "jmctheroes:chainsaw_hit");

    hero.setAttributeProfile(getProfile);
    hero.setTierOverride(getTierOverride);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SAW", sawProfile);
    hero.addAttributeProfile("Charged", chargedProfile);
    hero.setTickHandler((entity, manager) => {
        var speeding = entity.getData("jmctheroes:dyn/suit_timer") == 1 && entity.isSprinting() && entity.isOnGround() && entity.getHeldItem().isEmpty();
        var notspeeding = !entity.getData("jmctheroes:dyn/suit_timer") == 1 || !entity.isSprinting() || !entity.isOnGround() || !entity.getHeldItem().isEmpty();
        manager.setData(entity, "fiskheroes:energy_projection", speeding);
        if (speeding) {
            manager.setData(entity, "fiskheroes:shield", true);
            manager.setData(entity, "fiskheroes:shield_blocking", true);
        }
        if (notspeeding) {
            manager.setData(entity, "fiskheroes:shield", false);
            manager.setData(entity, "fiskheroes:shield_blocking", false);
        }
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
    return entity.getData("jmctheroes:dyn/suit") ? 6 : 4;
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
    default:
        return true;
    }
}

function getProfile(entity) {
    if (entity.getData("jmctheroes:dyn/suit_timer") == 1 && entity.isSprinting() && entity.isOnGround() && entity.getHeldItem().isEmpty()) {
        return "Charged";
    }
    if (entity.getData("jmctheroes:dyn/suit")) {
        return "SAW";
    }
}

function chargedProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 4.7, 0);
    profile.addAttribute("SPRINT_SPEED", 1.7, 1);
}

function sawProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 0.95, 1);
    profile.addAttribute("JUMP_HEIGHT", 3.5, 0);
    profile.addAttribute("PUNCH_DAMAGE", 8.4, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("WEAPON_DAMAGE", -0.35, 1);
}