var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Martian Manhunter/J'onn J'onzz");
    hero.setTier(9);
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("loriatpack:martian_physiology", "loriatpack:martian_shape");
    hero.addAttribute("PUNCH_DAMAGE", 11.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
	hero.addAttribute("MAX_HEALTH", 8.0, 0);
	
    hero.addKeyBind("SHAPE_SHIFT", "key.shapeShift", 1);
    hero.addKeyBindFunc("func_SHIFT_RESET", ShapeShiftReset, "key.shapeShiftReset", 1);
    hero.addKeyBind("CHARGED_BEAM", "Psionic Lightning", 2);   
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 3);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 4);
    hero.addKeyBind("HEAT_VISION", "Heat Vision", 5);
	hero.addKeyBind("TELEPORT", "Teleport To The Moon", 3);  

    
    hero.setDefaultScale(1);
    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");

    hero.setTickHandler((entity, manager) => {
        utils.flightOnIntangibility(entity, manager);

        if (entity.getData("fiskheroes:shape_shifting_to") == "human") {
            manager.setData(entity, "loriatpack:dyn/human_form", true);
        } 
        if (entity.getData("fiskheroes:shape_shifting_to") != "human") {
            manager.setData(entity, "loriatpack:dyn/human_form", false);
        }

        if (entity.getData("fiskheroes:shape_shifting_to") == null || entity.getData("fiskheroes:shape_shifting_to") == "martian") {
            manager.setData(entity, "loriatpack:dyn/martian_form", true);
        } else {
            manager.setData(entity, "loriatpack:dyn/martian_form", false);
        }
        if (entity.getData("fiskheroes:shape_shifting_to") == "martian snake") {
            manager.setData(entity, "fiskheroes:scale", 2.0);
            manager.setData(entity, "loriatpack:dyn/true_form", true);
        } else {
            manager.setData(entity, "loriatpack:dyn/true_form", false);
        }

        manager.incrementData(entity, "loriatpack:dyn/human_form_timer", 7, 12, entity.getData("loriatpack:dyn/human_form"));
        manager.incrementData(entity, "loriatpack:dyn/martian_form_timer", 7, 12, entity.getData("loriatpack:dyn/martian_form"));
        manager.incrementData(entity, "loriatpack:dyn/true_form_timer", 7, 12, entity.getData("loriatpack:dyn/true_form"));

    });

    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function ShapeShiftReset(entity, manager) {
    manager.setDataWithNotify(entity, "fiskheroes:shape_shift_timer", 1);
    manager.setDataWithNotify(entity, "fiskheroes:shape_shifting_to", null);
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHAPE_SHIFT":
        return !entity.isSneaking();
    case "func_SHIFT_RESET":
        return entity.getData("fiskheroes:shape_shifting_to") != null && entity.isSneaking();
    case "CHARGED_BEAM":
        return !entity.getData("loriatpack:dyn/change_form");
    case "INTANGIBILITY":
        return !entity.getData("loriatpack:dyn/change_form") && entity.posY() < 700;	
    case "INVISIBILITY":
        return !entity.getData("loriatpack:dyn/change_form"); 
    case "HEAT_VISION":
        return !entity.getData("loriatpack:dyn/change_form") && !entity.getData("loriatpack:dyn/true_form") ;// && !entity.getData("loriatpack:dyn/human_form");
	case "TELEPORT":
          return entity.posY() > 700;
    default:
        return true;
}
}

