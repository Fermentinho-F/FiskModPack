var utils = implement("fiskheroes:external/utils");
function init(hero) {
    hero.setName("Miss Martian/\u00A7c\u00A7lAP 1");
    hero.setVersion("Young Justice Season 2");
    hero.setTier(8);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:miss_martian_powers_s2");
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);
    hero.addKeyBind("SHIELD", "Telekinetic Forcefield", 3);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 4);
    
    hero.setHasProperty(hasProperty);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHAPE_SHIFT":
        return !entity.isSneaking();
    case "SHAPE_SHIFT_RESET":
        return entity.isSneaking();
    default:
        return true;
    }
}
function hasProperty(entity, property) {
    switch (property) {
    case "MASK_TOGGLE":
        return entity.isAlive();
    case "BREATHE_SPACE":
        return entity.isAlive();
    default:
        return false;
    }
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.1, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : null;
}