function init(hero) {
    hero.setName("Nova");
    hero.setTier(7);

    hero.setChestplate("helmet");

    hero.addPowers("emo:nova");
    hero.addAttribute("PUNCH_DAMAGE", 9.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 700.0, 0);
    hero.addAttribute("IMPACT_DAMAGE", 0.3, 1);

    hero.addKeyBind("CHARGED_BEAM", "Energy Blast", 1);
    hero.addKeyBind("AIM", "Mini Energy Blast", 2);
    hero.addKeyBind("SHIELD", "Energy Shield", 3);

    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.supplyFunction("canAim", canAim);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", 0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}


function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}