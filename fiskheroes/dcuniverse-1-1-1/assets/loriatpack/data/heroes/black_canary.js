function init(hero) {
    hero.setName("Black Canary/Dinah Lance");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.cowl");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:tactical_tonfa{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:bo_staff", true);

    hero.addPowers("loriatpack:cnary_cry");
    hero.addAttribute("PUNCH_DAMAGE", 5.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
	
    hero.addKeyBind("SONIC_WAVES", "Canary Cry", 4);
	hero.addKeyBind("ENERGY_PROJECTION", "Canary Cry", 4);
	hero.addKeyBind("CHARGED_BEAM", "Deadly Scream", 1);
	
	hero.addAttributeProfile("STARE", stareProfile);
	hero.setAttributeProfile(getProfile);
}


function getProfile(entity) {
	if (entity.getData("fiskheroes:beam_shooting") ) {
        return "STARE";
    }
	return false;
}

function stareProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -2.0, 0);
	profile.addAttribute("JUMP_HEIGHT", -5.0, 0);
}