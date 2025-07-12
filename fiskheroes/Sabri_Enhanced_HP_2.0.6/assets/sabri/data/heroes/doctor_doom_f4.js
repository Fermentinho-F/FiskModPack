function init(hero) {
    hero.setName("Doctor Doom");
    hero.setVersion("Fantastic 4");
    hero.setTier(6);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.trenchcoat");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.shoes");
    
    hero.addPowers("sabri:electrokinesis_f4", "sabri:cosmic_rays_enhancement");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 5.0, 0);
	
    hero.addKeyBind("CHARGED_BEAM", "Electricity Blast", 1);
    
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:lightning_cast") {
        return!entity.getData("fiskheroes:beam_charging")
    }
    return true;
}

function isKeyBindEnabled(entity, keyBind) {
    return entity.getHeldItem().isEmpty();
}