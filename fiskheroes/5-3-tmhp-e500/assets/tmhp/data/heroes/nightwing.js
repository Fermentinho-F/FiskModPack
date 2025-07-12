function init(hero) {
    hero.setName("Nightwing/\u00A7c\u00A7lAP 3");
    hero.setVersion("Comics");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:tactical_tonfa{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    hero.addPrimaryEquipment("fiskheroes:bo_staff", true);
    
    hero.addPowers("tmhp:nightwing_suit", "fiskheroes:web_wings");
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("ELECTRICAL_SUIT", "Electrical Suit", 2);
    hero.addKeyBindFunc("func_WEB_WINGS", webWingsKey, "Gliding", 3);
    
    hero.addAttributeProfile("ELECTRICAL", electricalProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setHasPermission(hasPermission);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying")) {
            manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
        }
        manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);
    });
}

function hasPermission(entity, permission) {
    return permission == "USE_GRAPPLING_GUN";
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:flight":
        return entity.isInWater();
    case "fiskheroes:controlled_flight":
        return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
    case "fiskheroes:gliding":
        return entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem() && !entity.getData("fisktag:dyn/leap_cooldown");
    default:
        return true;
    }
}
function webWingsKey(player, manager) {
    if (player.isOnGround() || player.isInWater()) {
        return false;
    }
    
    var flag = player.getData("fiskheroes:gliding");
    
    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:web_swinging", false);
    }
    
    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_WEB_WINGS":
        return !entity.isOnGround() && !entity.isInWater() && !entity.as("PLAYER").isUsingItem();
    default:
        return true;
    }
}
function getAttributeProfile(entity) {
    return entity.getData("tmhp:dyn/electrical") ? "ELECTRICAL" : null;
}
function electricalProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 1.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 3.0, 0);
    profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
}