var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Project Vision (Space Stone)");
    hero.setTier(9);
    
    hero.setChestplate("Armor");
    
    hero.addPowers("fiskheroes:vibranium_physiology", "emo:stone");
    hero.addAttribute("PUNCH_DAMAGE", 12.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.30, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 100.0, 1);

    hero.addKeyBind("CHARGED_BEAM", "Space Stone Lazer", 1);
    hero.addKeyBind("INTANGIBILITY", "intangibility", 2);
    hero.addKeyBind("TELEPORT", "teleport", 3);
    hero.addKeyBind("TELEKINESIS", "telekinesis", 4);
    hero.addKeyBind("NANITE_TRANSFORM", "Change Form", 5);

   
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:leaping":
            return entity.getData("fiskheroes:dyn/nanites");
        case "fiskheroes:intangible":
            return entity.getData("fiskheroes:dyn/nanites");
        default:
            return true;
        }
    }

function isKeyBindEnabled(entity, keyBind) {
    if (entity.isSprinting() && entity.getData("fiskheroes:flying")) {
        return keyBind != "NANITE_TRANSFORM";
    }
    
    switch (keyBind) {
        case "TELEPORT":
             return entity.getData("fiskheroes:dyn/nanites");
        case "TELEKINESIS":
             return entity.getData("fiskheroes:dyn/nanites");
        case "INTANGIBILITY":
            return entity.getData("fiskheroes:dyn/nanites");
        case "NANITE_TRANSFORM":
            return !entity.getData("fiskheroes:intangible");
        default:
            return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:dyn/nanites") && !entity.getData("fiskheroes:shield");
}
