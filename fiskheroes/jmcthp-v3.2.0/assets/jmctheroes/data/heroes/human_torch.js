var landing = implement("jmctheroes:external/fire_landing");

function init(hero) {
    hero.setName("Human Torch");
    hero.setVersion("Fantastic 4");
    hero.setAliases("torch");
    hero.setTier(4);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("jmctheroes:cosmic_ray_enhanced_physiology_human_torch");
    hero.addAttribute("FALL_RESISTANCE", 1.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.75, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    
    hero.addKeyBind("AIM", "key.aim", 1);
    hero.addKeyBind("FLAME_ON", "Flame On!", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);  
    hero.setTickHandler((entity, manager) => {
        landing.tick(entity, manager);
        var flying = entity.getData("fiskheroes:flying");
        var fire_timer = entity.getData("jmctheroes:dyn/torch_timer");
        var onground = entity.isOnGround();
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        if (!onground && fire_timer < 1 && fire_timer > 0){
            manager.setData(entity, "fiskheroes:flying", true);
        }
        if (entity.isInWater()) {
            manager.setData(entity, "jmctheroes:dyn/torch", false);
        }
    });
}

function isKeyBindEnabled(entity, keyBind) {
    if (entity.getData("jmctheroes:dyn/torch") && entity.isSprinting() && entity.getData("fiskheroes:flying") && !entity.isInWater() && !entity.world().getDimension() == 2595) {
        return false;
    }
    switch (keyBind) {
    case "AIM":
        return entity.getHeldItem().isEmpty() && entity.getData("jmctheroes:dyn/torch") && !entity.isInWater();
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.id()) {
    case "fiskheroes:fireball":
        return (entity.getData("jmctheroes:dyn/torch") && !entity.isInWater());
    case "fiskheroes:flame_blast":
        return (entity.getData("jmctheroes:dyn/torch") && !entity.isInWater());
    case "fiskheroes:controlled_flight":
        return (entity.getData("jmctheroes:dyn/torch") && !entity.isInWater());
    case "fiskheroes:fire_immunity":
        return (entity.getData("jmctheroes:dyn/torch") && !entity.isInWater());
    case "fiskheroes:damage_weakness":
        return entity.getData("jmctheroes:dyn/torch");
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("jmctheroes:dyn/torch") && !entity.isInWater();
}