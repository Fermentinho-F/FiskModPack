function init(hero) {
    hero.addKeyBind("HEAT_VISION_HEATBLAST1", "Heat Blast", 1);
    hero.addKeyBindFunc("func_HEATJAWS_BLAST", heatjawsBlast, "Water Boil", 2);

    hero.addKeyBind("AIM", "Aim", 1);
    hero.addKeyBind("HEAT_VISION", "Aim", 1); 

    hero.addDamageProfile("FLAME_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 0.4
        },
        "properties": {
            "HEAT_TRANSFER": 60,
            "IGNITE": 1
        }
    });

    hero.addAttributeProfile("HEATJAWS_STANDING", profile => {
        profile.addAttribute("PUNCH_DAMAGE", -20.0, 0);
        profile.addAttribute("BASE_SPEED", -10.0, 1);
        profile.addAttribute("JUMP_HEIGHT", -10.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 0.65, 1);
    });

    hero.addAttributeProfile("HEATJAWS_WATER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.0, 0);
        profile.addAttribute("JUMP_HEIGHT", 1.0, 0);
        profile.addAttribute("FALL_RESISTANCE", 10.0, 0);
        profile.addAttribute("SPRINT_SPEED", 0.2, 1);
        profile.addAttribute("IMPACT_DAMAGE", 0.4, 1);
    });

    // RIPJAWS ATTRIBUTE PROFILE WHEN ON LAND
    hero.addAttributeProfile("RIPJAWS_LAND1", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 5, 0);
        profile.addAttribute("FALL_RESISTANCE", 8.0, 0);
        profile.addAttribute("MAX_HEALTH", -4, 0);
    });

    hero.addAttributeProfile("RIPJAWS_LAND2", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 3, 0);
        profile.addAttribute("FALL_RESISTANCE", 6.0, 0);
        profile.addAttribute("MAX_HEALTH", -8, 0);
    });

    hero.addAttributeProfile("RIPJAWS_LAND3", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 2, 0);
        profile.addAttribute("FALL_RESISTANCE", 4.0, 0);
        profile.addAttribute("MAX_HEALTH", -11, 0);
        profile.addAttribute("BASE_SPEED", -0.02, 0);
    });

    hero.addAttributeProfile("RIPJAWS_LAND4", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 1, 0);
        profile.addAttribute("MAX_HEALTH", -17, 0);
        profile.addAttribute("BASE_SPEED", -0.05, 0);
    });

    hero.addAttributeProfile("DEAD", profile => {
        profile.addAttribute("MAX_HEALTH", -19, 0);
        profile.addAttribute("BASE_SPEED", -0.07, 0);
    });
}

function tick(entity, manager, isCurrent) {
    if (!isCurrent) {
        return;
    }

    var nbt = entity.getWornChestplate().nbt();	
    var isPlayerSubmerged = entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water';
    var isWet = entity.isWet();

    if (entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
        if (!isPlayerSubmerged && !isWet && !entity.getData('fiskheroes:aiming')) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 2400, !isPlayerSubmerged ? 1 : 0);
        }

        if (!isPlayerSubmerged && isWet && !entity.getData('fiskheroes:aiming')) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 2600, !isPlayerSubmerged ? 1 : 0);
        }

        if (!isPlayerSubmerged && entity.getData('fiskheroes:aiming')) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 1800, true);
        }

        if (isPlayerSubmerged) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 500, !isPlayerSubmerged ? 1 : 0);
        }
    }

    manager.incrementData(entity, "tmf:dyn/pc_2", 12, (entity.getData('fiskheroes:beam_shooting_timer') != 0) ? 1 : 0);
}

function getAttributeProfile(entity) {
    var PT1 = entity.getData('tmf:dyn/pt_1');
    var isPlayerSubmerged = entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water';
    if (isPlayerSubmerged) {
        return "RIPJAWS_WATER";
    } 
    else {
        if (PT1 == 1) {
            return "DEAD";
        }
        if (PT1 >= 0.8 && PT1 != 1) {
            return "RIPJAWS_LAND4";
        }
        if (PT1 >= 0.6 && PT1 < 0.8) {
            return "RIPJAWS_LAND3";
        }
        if (PT1 >= 0.4 && PT1 < 0.6) {
            return "RIPJAWS_LAND2";
        }
        if (PT1 >= 0 && PT1 < 0.4) {
            return "RIPJAWS_LAND1";
        }
    }
}

function getDamageProfile(entity) {
    return entity.getHeldItem().isEmpty() ? "FLAME_PUNCH" : null;
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	

    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var isPlayerSubmerged = entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water';

    if (keyBind == "HEAT_VISION_HEATBLAST1") {
        return entity.getHeldItem().isEmpty();
    }
    
    if (keyBind == "AIM") {
        return entity.getHeldItem().isEmpty();
    }
    if (keyBind == "HEAT_VISION") {
        return entity.getHeldItem().isEmpty();
    }
    if (keyBind == "func_HEATJAWS_BLAST") {
        return isPlayerSubmerged;
    }

    return false;
}

function hasProperty(entity, property) {
    return false;
}

function canAim(entity) {
    var PC1 = entity.getData('tmf:dyn/pc_1');
    var P2 = entity.getData('tmf:dyn/p_2');
    return (entity.getHeldItem().isEmpty());
}

function getDefaultScale(entity) {
    return 1 + 0.05*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}
function getTierOverride(entity) {
    var isPlayerSubmerged = entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water';
    if (isPlayerSubmerged) {
        return 6;
    } 
    else {
        return 2;
    }
}

function heatjawsBlast(player, manager) {
    manager.setData(player, "fiskheroes:beam_charging", player.getData('fiskheroes:beam_charge') == 0 ? true : false);

    return true;
}
