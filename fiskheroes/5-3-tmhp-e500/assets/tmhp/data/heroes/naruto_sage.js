function init(hero) {
    hero.setName("Naruto/\u00A7c\u00A7lAP 9");
    hero.setVersion("Naruto Sage Mode");
    hero.setTier(6);
    
    hero.setHelmet("Headband");
    hero.setChestplate("Jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:kyuubi_chakra", "tmhp:sage_mod");
    hero.addAttribute("FALL_RESISTANCE", 12.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 2.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.5, 0);
    hero.addAttribute("STEP_HEIGHT", 1.0, 0);
    
    hero.addKeyBind("SPELL_MENU", "Kage Bunshin no Jutsu", 1);
    hero.addKeyBind("CHARGE_ICE", "Oodama Rasengan", 2);
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 3);
    hero.addKeyBind("CHARGED_BEAM", "Rasen-Shuriken", 4);
    hero.addKeyBind("SAGE", "Sage Mod", 5);

    hero.addAttributeProfile("SAGE", sageProfile);
    hero.setAttributeProfile(getProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ICE":
        return entity.getHeldItem().isEmpty();
    case "SPELL_MENU":
        return entity.getHeldItem().isEmpty();
    case "CHARGED_BEAM":
        return entity.getHeldItem().isEmpty() && entity.getData('tmhp:dyn/sage_mod') && !entity.getInterpolatedData("fiskheroes:cryo_charge");
    default:
        return true;
    }
}
function sageProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 16.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.9, 1);
    profile.addAttribute("JUMP_HEIGHT", 4.0, 0);
}
function getProfile(entity) {
    return entity.getData("tmhp:dyn/sage_mod") ? "SAGE" : null;
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:damage_bonus":
        return modifier.id() == "sage_rasengan" == (entity.getData("tmhp:dyn/sage_mod"));
    case "fiskheroes:damage_bonus":
        return modifier.id() == "oodama_rasengan" == (!entity.getData("tmhp:dyn/sage_mod"));
    case "fiskheroes:cryo_charge":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:beam_charging");
    default:
        return true;
    }
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/sage_mod") ? 6 : 2;
}