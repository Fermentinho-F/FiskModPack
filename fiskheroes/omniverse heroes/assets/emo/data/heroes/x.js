var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("30th dimension guest");
    hero.setTier(10);
    
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    
    hero.addPowers("emo:x", "fiskheroes:vibranium_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("KNOCKBACK", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 5.5, 1);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 4.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1000.0, 1);
    
    hero.addKeyBind("CHARGED_BEAM", "Universe Beam", 1);
    hero.addKeyBind("TELEKINESIS", "telekinesis", 1);
    hero.addKeyBind("TELEPORT", "teleport", 2);
    hero.addKeyBind("INVISIBILITY", "invisibility", 3);
    hero.addKeyBind("INTANGIBILITY", "intangibility", 4);
    hero.addKeyBind("SPELL_MENU", "Spell Menu", 5);
    
    hero.setDefaultScale(1.1);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setHasProperty(hasProperty);
    hero.supplyFunction("canAim", canAim);
    hero.setTickHandler((entity, manager) => {
        var shadowform = entity.getData('fiskheroes:shadowform')
		
		if (shadowform) {
			manager.setData(entity, 'fiskheroes:dyn/nanites', true)
		}
		else {
			manager.setData(entity, 'fiskheroes:dyn/nanites', false)
		}
		
        manager.setData(entity, "fiskheroes:shadowform", entity.getData("fiskheroes:flying") && entity.isSprinting());
        utils.flightOnIntangibility(entity, manager);
    });
}

function isModifierEnabled(entity, modifier) {
    if(modifier.name() != "fiskheroes:cooldown" && entity.getData('fiskheroes:dyn/nanite_cooldown') >= 0.8 && !entity.getData('fiskheroes:dyn/nanites')) {
		return false;
	}
    switch (modifier.name()) {
	case "fiskheroes:energy_projection":
        return !entity.getData("fiskheroes:shadowform");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    if(entity.getData('fiskheroes:dyn/nanite_cooldown') >= 0.8 && !entity.getData('fiskheroes:dyn/nanites')) {
		return false;
	}
	
    switch (keyBind) {
    case "AIM":
        return !entity.getData("fiskheroes:shadowform");
	case "ENERGY_PROJECTION":
        return !entity.getData("fiskheroes:shadowform");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE";
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}
