var utils = implement("fiskheroes:external/utils");
var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("Dark Danny/\u00A7c\u00A7lAP 7");
    hero.setTier(7);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:dark_ghost_powers");

    hero.addKeyBind("CHARGED_BEAM", "Ghost Ray", 1);
    hero.addKeyBind("SONIC_WAVES", "Ghostly Wail", 2);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 3);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 4);
    hero.addKeyBind("SPELL_MENU", "Spectral Copies", 5);

    hero.addAttribute("PUNCH_DAMAGE", 17.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);

    hero.supplyFunction("canAim", canAim);
    hero.setDefaultScale(1.05);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
        landing.tick(entity, manager);
    });
}
function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SONIC_WAVES":
        return !entity.getData("tmhp:dyn/ghostly_wail") || entity.getData("fiskheroes:sonic_waves");
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:fire_immunity":
        return entity.getData("fiskheroes:intangible");
    case "fiskheroes:water_breathing":
        return entity.getData("fiskheroes:intangible");
    default:
        return true;
    }
}