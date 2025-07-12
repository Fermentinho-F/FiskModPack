function init(hero) {
    hero.setName("Anakin Skywalker/\u00A7c\u00A7lAP 4");
    hero.setVersion("Clone Wars");
    hero.setTier(7);
    
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPowers("tmhp:force");
    
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 25.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);

    hero.addKeyBind("SHIELD", "Ignite Youngling Slayer 2000", 1);
    hero.addKeyBind("TELEKINESIS", "Force Grap", 2);
    hero.addKeyBind("ENERGY_PROJECTION", "Force Choke", 2);
    hero.addKeyBind("SPELL_MENU", "Force Push", 3);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addAttributeProfile("LIGHTSABER", lightsaberProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:flying")) {
            manager.setInterpolatedData(entity, "fisktag:dyn/leap_cooldown", 1);
        }
        manager.incrementData(entity, "fisktag:dyn/leap_cooldown", 40, false);
    });
    hero.addDamageProfile("LIGHTSABER", {
        "types": {
            "SHARP": 1.0,
            "ENERGY": 1.0
        }
    });
}

function lightsaberProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
}
function getProfile(entity) {
    return entity.getData("fiskheroes:shield") ? "LIGHTSABER" : null;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {    
    case "ENERGY_PROJECTION":
        return entity.getData('fiskheroes:telekinesis') && entity.isSneaking();
    default:
        return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.isSprinting() && entity.getData("fisktag:dyn/leap_cooldown") == 0;
        default:
            return true;
    }
}