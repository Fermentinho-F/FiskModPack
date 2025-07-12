function init(hero) {
    hero.setName("Klaus Mikaelson");
    hero.setTier(3);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("emo:originals");
    hero.addAttribute("JUMP_HEIGHT", 4.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("FALL_RESISTANCE", 9.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);

    hero.addKeyBind("HYBRID", "Hybrid Power", 1);
    hero.addKeyBind("VAMPIRE", "Vampire Punch", 2);
    hero.addKeyBind("SUPER_SPEED", "Vampire Speed", 3);
	hero.addKeyBind("SLOW_MOTION", "Slow Vision", 4);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("HYBRID", hybridProfile);
    hero.addAttributeProfile("VAMPIRE", vampireProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("HYBRID", {"types": {"SHARP": 1.0}});
    hero.addDamageProfile("BLADE", {
        "types": {
            "SHARP": 1.0,
            "COLD": 0.4
        }
    });
}
function hybridProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 13.0, 0);
    profile.addAttribute("JUMP_HEIGHT", 5.1, 0);
    profile.addAttribute("SPRINT_SPEED", 1.1, 1);
    profile.addAttribute("KNOCKBACK", 6.5, 0);
}

function vampireProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("KNOCKBACK", 6.5, 0);
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "VAMPIRE":
            return !entity.getData("emo:dyn/el_timer")
        
         default:
         return true;
 }

}

function getAttributeProfile(entity) {
    return entity.getData("emo:dyn/el_timer") ? "HYBRID" :  entity.getData("emo:dyn/sword_timer") ? "VAMPIRE" : null;
}

function getProfile(entity) {
    return entity.getData("emo:dyn/el_timer") ? "HYBRID" :  entity.getData("emo:dyn/sword_timer") ? "VAMPIRE" : null;
}
