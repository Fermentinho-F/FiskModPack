function init(hero) {
    hero.setName("Batman/\u00A7c\u00A7lAP 2");
    hero.setVersion("Comics");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("tmhp:batsuit", "tmhp:water_breathing");
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBindFunc("func_WEB_WINGS", webWingsKey, "Gliding", 2);
    
    hero.setHasPermission(hasPermission);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying")) {
            manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
        }
        manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);
    });
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
        return !entity.getData("fisktag:dyn/leap_cooldown");
    default:
        return true;
    }
}
