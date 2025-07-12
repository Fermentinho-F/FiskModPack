function init(hero) {
    hero.setName("Geralt of Rivia (Witcher)");
    hero.setTier(5);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.addPrimaryEquipment("fiskheroes:katana", true);
    
    hero.addPowers("emo:witcher");
    hero.addAttribute("JUMP_HEIGHT", 3.1, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("FALL_RESISTANCE", 20.5, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 2.0, 0);

    hero.addKeyBind("SHIELD", "Silver Sword", 1);
    hero.addKeyBind("SUPER_SPEED", "Witcher Speed", 2);
    hero.addKeyBind("SLOW_MOTION", "slow vision", 3);
	hero.addKeyBind("AIM", "Igni", 4);
    hero.addKeyBind("CHARGED_BEAM", "Aard", 5);

    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {"types": {"SHARP": 1.0}});
    hero.supplyFunction("canAim", canAim);
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "SHIELD" : null;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}