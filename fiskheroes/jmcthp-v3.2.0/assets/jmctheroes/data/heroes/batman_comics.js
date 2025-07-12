function init(hero) {
    hero.setName("hero.fiskheroes.batman_dceu.name");
    hero.setVersion("item.superhero_armor.version.comics");
    hero.setAliases("bmc");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    
    hero.addPowers("jmctheroes:batsuit", "jmctheroes:utility_belt");
    hero.addAttribute("PUNCH_DAMAGE", 6.6, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.2, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("BLADE", "Kryptonite Knuckles", 2);
    hero.addKeyBind("REBREATHER", "Rebreather", 3);
    
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN"); 
    hero.setTickHandler((entity, manager) => {
        if (!entity.isInWater()) {
            manager.setData(entity, "jmctheroes:dyn/rebreather", false);
        }
    });
    hero.addDamageProfile("BLADE", {
        "types": {
            "KRYPTONITE": 8.5
        }
    });
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.4, 0);
}

function getDamageProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? "BLADE" : null;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "REBREATHER":
        return entity.world().getBlock(entity.pos().add(0, 2, 0)) == 'minecraft:water';
    case "BLADE":
        return !entity.getData("fiskheroes:gliding");
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:water_breathing":
        return (entity.getData("jmctheroes:dyn/rebreather_timer") > 0);
    case "fiskheroes:blade":
        return !entity.getData("fiskheroes:gliding");
    default:
        return true;
    }
}