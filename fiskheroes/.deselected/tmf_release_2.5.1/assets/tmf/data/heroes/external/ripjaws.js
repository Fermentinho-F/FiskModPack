function init(hero) {


    hero.addKeyBind("CHARGED_BEAM", "Optic Blast", 1);
    hero.addKeyBind("CHARGED_BEAM2", "Bite", 1);

    hero.addDamageProfile("RIPJAWS", {
        "types": {
            "BLUNT": 1.0,
            "SHARP": 0.65
        }
    });

    // RIPJAWS ATTRIBUTE PROFILE WHEN IN WATER
    hero.addAttributeProfile("RIPJAWS_WATER", profile => {
        profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
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
    var SL = nbt.getByte("ripjaws");
    var isPlayerSubmerged = entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water';
    var isWet = entity.isWet();

    if (entity.as("DISPLAY").getDisplayType() != "HOLOGRAM") {
        if (SL == 0 && !isPlayerSubmerged && !isWet) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 1200, !isPlayerSubmerged ? 1 : 0);
        }

        if (SL >= 15 && !isPlayerSubmerged && !isWet) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 2400, !isPlayerSubmerged ? 1 : 0);
        }

        if (SL == 0 && !isPlayerSubmerged && isWet) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 1400, !isPlayerSubmerged ? 1 : 0);
        }

        if (SL >= 15 && !isPlayerSubmerged && isWet) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 2600, !isPlayerSubmerged ? 1 : 0);
        }

        if (isPlayerSubmerged) {
            manager.incrementData(entity, "tmf:dyn/pt_1", 500, !isPlayerSubmerged ? 1 : 0);
        }
    }

    manager.incrementData(entity, "tmf:dyn/pt_3", 10, isPlayerSubmerged && entity.getData('fiskheroes:flying') ? 1 : 0);
}

function getDefaultScale(entity) {
    return 1 + 0.05*entity.getInterpolatedData('tmf:dyn/transformation_timer');
}
function getTierOverride(entity) {
    var isPlayerSubmerged = entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water';
    if (isPlayerSubmerged) {
        return 5;
    } 
    else {
        return 2;
    }
}

function isModifierEnabled(entity, modifier) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ripjaws");
    var isPlayerSubmerged = entity.isInWater() && entity.world().getBlock(entity.pos().add(0, 1.8, 0)) == 'minecraft:water';

    if (modifier.id() == "ripjaws_2") {
        return SL >= 15 && (isPlayerSubmerged || entity.getData('tmf:dyn/pt_3') != 0);
    }

    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    var nbt = entity.getWornChestplate().nbt();	
    var SL = nbt.getByte("ripjaws");
    if (keyBind == "CHARGED_BEAM") {
        return SL == 60;
    }
    if (keyBind == "CHARGED_BEAM2") {
        return SL == 60;
    }
    return false;
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
    return entity.getHeldItem().isEmpty() ? "RIPJAWS" : null;
}
/*
PLAN FOR RIPJAWS
    - FIRE WEAKNESS (DEHYDRATION)
    - LAND SURVIABILITY 
        - For the first level, player needs to get in water (player needs to be fully submerged) within the first 60 seconds or they will start taking damage
        - For the second level, player can stay on land for longer, gets access to the tail
        - For the third level, he gets access to claws & leaping ability
    - ICE AND ELECTRICITY WEAKNESS
    - POSSIBLE WATER VORTEX?
*/