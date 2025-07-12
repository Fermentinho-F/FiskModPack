var utils = implement("tmhp:external/naruto_utils");
function init(hero) {
    hero.setName("Naruto/\u00A7c\u00A7lAP 8");
    hero.setVersion("Naruto OG");
    hero.setTier(4);
    
    hero.setHelmet("Headband");
    hero.setChestplate("Jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:kyuubi_chakra");
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    
    hero.addKeyBind("SPELL_MENU", "Kage Bunshin no Jutsu", 1);
    hero.addKeyBind("CHARGE_ICE", "Rasengan", 2);
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 3);
    hero.addKeyBind("RAGE", "Rage Mod", 4);
    hero.addKeyBind("ONE_TAIL", "One Tail Mod", 4);

    hero.addAttributeProfile("RAGE", rageProfile);
    hero.addAttributeProfile("ONE_TAIL", one_tailProfile);
    hero.addAttributeProfile("ONE_TAIL_COOLDOWN", one_tail_cooldownProfile);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setTickHandler((entity, manager) => {
        utils.rage(entity, manager);
        utils.one_tail(entity, manager);
    });
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "UTILITY_BELT":
        return entity.getHeldItem().isEmpty() && !entity.getData('tmhp:dyn/one_tailed');
    case "CHARGE_ICE":
        return entity.getHeldItem().isEmpty();
    case "SPELL_MENU":
        return entity.getHeldItem().isEmpty();
    case "ONE_TAIL":
        return entity.getData('tmhp:dyn/rage') && !entity.getData('tmhp:dyn/one_tailed');
    case "RAGE":
        return !entity.getData('tmhp:dyn/rage');
    default:
        return true;
    }
}
function rageProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.9, 1);
    profile.addAttribute("JUMP_HEIGHT", 3.0, 0);
}
function one_tailProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
    profile.addAttribute("SPRINT_SPEED", 1.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 4.0, 0);
    profile.addAttribute("MAX_HEALTH", 10.0, 0);
}
function one_tail_cooldownProfile(profile) {
    profile.addAttribute("BASE_SPEED", -1.0, 1);
    profile.addAttribute("SPRINT_SPEED", -1.0, 0);
    profile.addAttribute("JUMP_HEIGHT", -1.0, 0);
    profile.addAttribute("MAX_HEALTH", -10.0, 0);
}
function getProfile(entity) {
    if (entity.getData("tmhp:dyn/one_tailed")) {
        return "ONE_TAIL";
    }
    else if (entity.getData("tmhp:dyn/one_tail_cooldown") && !entity.getData("tmhp:dyn/one_tailed")) {
        return "ONE_TAIL_COOLDOWN";
    }
    return entity.getData("tmhp:dyn/rage") ? "RAGE" : null;
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:transformation":
        return modifier.id() == "one_tail1" == (entity.getData("tmhp:dyn/rage"));
    case "fiskheroes:damage_bonus":
        return modifier.id() == "rasengan" == (!entity.getData("tmhp:dyn/one_tailed"));
    case "fiskheroes:damage_bonus":
        return modifier.id() == "rasengan_one_tail" == (entity.getData("tmhp:dyn/one_tailed"));
    case "fiskheroes:regeneration":
        return modifier.id() == "regen_kyuubi" == (entity.getData("tmhp:dyn/one_tailed"));
    case "fiskheroes:equipment":
        return !entity.getData("tmhp:dyn/one_tailed");
    case "fiskheroes:cryo_charge":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}
function getTierOverride(entity) {
   if (entity.getData("tmhp:dyn/one_tailed")) {
        return 4;
    }
    return entity.getData("tmhp:dyn/rage") ? 2 : 1;
}