var utils = implement("tmhp:external/naruto_utils");
function init(hero) {
    hero.setName("Sasuke/\u00A7c\u00A7lAP 8");
    hero.setVersion("Naruto OG");
    hero.setTier(4);
    
    hero.setHelmet("Headband");
    hero.setChestplate("Shirt");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:sharingan");
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("CHARGED_BEAM", "Fire Jutsu", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 2);
    hero.addKeyBind("CHARGE_ICE", "Chidori", 3);
    hero.addKeyBind("SHARINGAN", "Toggle Sharingan", 4);
    hero.addKeyBind("CURSE_MARK", "Toggle Curse Mark", 5);

    hero.addAttributeProfile("SHARINGAN", sharinganProfile);
    hero.addAttributeProfile("CURSE_MARK", curse_markProfile);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setTickHandler((entity, manager) => {
        utils.curse_mark(entity, manager);
    });
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ICE":
        return entity.getHeldItem().isEmpty() && entity.getData('tmhp:dyn/sharingan');
    case "CURSE_MARK":
        return entity.getData('tmhp:dyn/sharingan');
    case "CHARGED_BEAM":
        return !entity.isSneaking();
    case "SLOW_MOTION":
        return entity.getData('tmhp:dyn/sharingan') && entity.isSneaking();
    default:
        return true;
    }
}
function sharinganProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", 0.9, 1);
}
function curse_markProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
    profile.addAttribute("SPRINT_SPEED", 1.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 4.0, 0);
    profile.addAttribute("MAX_HEALTH", 10.0, 0);
}
function getProfile(entity) {
    if (entity.getData("tmhp:dyn/curse_mark")) {
        return "CURSE_MARK";
    }
    return entity.getData("tmhp:dyn/sharingan") ? "SHARINGAN" : null;
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:damage_bonus":
        return modifier.id() == "chidori" == (!entity.getData("tmhp:dyn/curse_mark"));
    case "fiskheroes:damage_bonus":
        return modifier.id() == "onyx_chidori" == (entity.getData("tmhp:dyn/curse_mark"));
    case "fiskheroes:cryo_charge":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/curse_mark") ? 4 : 2;
}