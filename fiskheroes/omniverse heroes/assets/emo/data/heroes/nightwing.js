function init(hero) {
    hero.setName("Nightwing");
    hero.setTier(7);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.legs");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:grappling_gun", true);
    hero.addPrimaryEquipment("fiskheroes:tactical_tonfa{Dual:1}", true, item => item.nbt().getBoolean("Dual"));

    hero.addPowers("emo:suit");
    hero.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 30.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    
    hero.addKeyBind("UTILITY_BELT", "key.utilityBelt", 1);
    hero.addKeyBind("STAFF", "Electro Bird", 2);
    hero.addKeyBind("CHARGE_ENERGY", "Charged Energy Punch", 3);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasPermission((entity, permission) => permission == "USE_GRAPPLING_GUN");
    hero.addAttributeProfile("STAFF", elProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);

}

function elProfile(profile) {
    profile.addAttribute("FALL_RESISTANCE", 40, 1);
    profile.addAttribute("PUNCH_DAMAGE", 12.0, 0);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:lightning_cast":
            return entity.getData("emo:dyn/el");
        case "fiskheroes:energy_manipulation":
            return entity.getData("emo:dyn/el");
            default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGE_ENERGY":
             return entity.getData("emo:dyn/el");
        default:
            return true;
    }
}

function getProfile(entity) {
    if (entity.getData("emo:dyn/el")) {
        return "STAFF";
    }
}