function init(hero) {
    hero.setName("Death Note (Creative Item)");
    hero.setTier(10);
    
    hero.setChestplate("Or Book");
    
    hero.addPowers("emo:note");
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);

    hero.addKeyBind("BOOK", "Open/Close  Death Note", 1);
    hero.addKeyBind("HEAT_VISION", "Write name on note (look at player)", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isModifierEnabled(entity, modifier) {  
    switch (modifier.name()) {
        case "fiskheroes:heat_vision":
            return entity.getData("fiskheroes:dyn/nanites");
        default:
            return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "HEAT_VISION":
            return entity.getData("fiskheroes:dyn/nanites");
        default:
            return true;
    }
}
