function init(hero) {
    hero.setName("The Thing");
    hero.setVersion("Fantastic 4");
    hero.setAliases("thing");
    hero.setTier(8);
    
    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Shorts");
    hero.setBoots("Feet");
    
    hero.addPowers("jmctheroes:cosmic_ray_enhanced_physiology_thing", "jmctheroes:charged_jump");
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.75, 0);
    hero.addAttribute("PUNCH_DAMAGE", 11.4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.75, 1);
    hero.addAttribute("WEAPON_DAMAGE", -0.75, 1);
    hero.addAttribute("MAX_HEALTH", 8.0, 0);

    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);
    hero.addKeyBind("GROUND_SMASH", "key.groundSmash", 2);

    hero.setDefaultScale(1.35);
    hero.setAttributeProfile(getProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("JUMP", jumpProfile);

    hero.setTickHandler((entity, manager) => {
        if ((!entity.isSprinting() && entity.getData('jmctheroes:dyn/charged_jump_timer') < 0.90
        || !entity.isOnGround() || !entity.isSprinting() && entity.motionX() > 0 || !entity.isSprinting() && entity.motionZ() > 0) &&  entity.getData('jmctheroes:dyn/charged_jump')) {
            manager.setData(entity,"jmctheroes:dyn/charged_jump", false)
        }
        if (entity.getData("jmctheroes:dyn/charged_jump_timer") == 0  && entity.isSprinting() && entity.isOnGround()
        &&  !entity.getData('jmctheroes:dyn/charged_jump') ) {
            manager.setData(entity,"jmctheroes:dyn/charged_jump", true)
        }
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:leaping":
        return entity.isSprinting();
    default:
        return true;
    }
}
function jumpProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("JUMP_HEIGHT", 15, 0);
    profile.addAttribute("SPRINT_SPEED", 0.95, 1);
}

function getProfile(entity) {
    if (entity.getData('jmctheroes:dyn/charged_jump_timer') > 0.90) {
        return "JUMP";
    }
        return null;
}
