function init(hero) {
    hero.setName("Robin/\u00A7c\u00A7lAP 3");
    hero.setVersion("Demian Wayne-Dc Animated Movie Universe");
    hero.setTier(5);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:katana", true, item => !item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("tmhp:batsuit");
    hero.addAttribute("PUNCH_DAMAGE", 3.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.3, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBindFunc("func_WEB_WINGS", webWingsKey, "Gliding", 3);
    
    hero.setDefaultScale(0.77);
    hero.setHasPermission(hasPermission);
    hero.setHasProperty(hasProperty);
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

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
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