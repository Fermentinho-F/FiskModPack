function init(hero) {
    hero.setName("Julius Novachrono/\u00A7d\u00A7lAP 10");
    hero.setVersion("Black Clover:Elf Saga");
    hero.setTier(10);
    
    hero.setChestplate("Robe");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:jikan_mahou");
    hero.addAttribute("PUNCH_DAMAGE", 0.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addAttribute("MAX_HEALTH", 40.0, 0);
    
    hero.addKeyBind("CHARGE_ICE", "Time Orb", 1);
    hero.addKeyBind("CHARGED_BEAM", "Time Beam (Attack)", 2);
    hero.addKeyBind("ENERGY_PROJECTION", "Time Beam (Restraining)", 3);
    hero.addKeyBind("TELEPORT", "key.teleport", 4);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 4);
    hero.addKeyBind("OPEN_GRIMOIRE", "Open/Close Grimoire", 5);
    hero.addKeyBind("USE_STOLEN_TIME", "Use Stolen Time to Heal Yourself", 5);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("TIMEORB", {
        "types": {
            "TIME": 1.0
        }
    });
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ICE":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "CHARGED_BEAM":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "ENERGY_PROJECTION":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "TELEPORT":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 && !entity.isSneaking();
    case "SLOW_MOTION":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 && entity.isSneaking();
    case "USE_STOLEN_TIME":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 && entity.isSneaking();
    case "OPEN_GRIMOIRE":
        return !entity.isSneaking();
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:regeneration":
        return entity.getData("tmhp:dyn/regen");
    default:
        return true;
    }
}
function getDamageProfile(entity) {
    return entity.getData("fiskheroes:cryo_charge") ? "TIMEORB" : null;
}