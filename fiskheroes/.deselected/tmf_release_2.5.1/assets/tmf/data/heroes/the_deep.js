function init(hero) {
    hero.setName("The Deep");
    hero.setVersion("The Boys");
    hero.setTier(6);
   
    hero.setChestplate("Vest");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("tmf:compound_v_the_deep");
	
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 7.0, 0);

    hero.addKeyBind("CAMOUFLAGE", "Camouflage", 5);

    hero.setModifierEnabled(isModifierEnabled);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:controlled_flight":
            return entity.isInWater();
        default:
            return true;
    }
}
