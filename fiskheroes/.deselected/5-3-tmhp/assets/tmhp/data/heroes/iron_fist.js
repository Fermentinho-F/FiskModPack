function init(hero) {
    hero.setName("Iron Fist/\u00A7c\u00A7lAP 5");
    hero.setVersion("Ultimate Spider-Man");
    hero.setTier(3);
    
    hero.setHelmet("item.superhero_armor.piece.mask");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("tmhp:chi");
    hero.addAttribute("FALL_RESISTANCE", 13.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);
    
    hero.addKeyBind("CHARGE_ICE", "Charge Chi", 1);
    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 2);

    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "CHARGE_ICE":
        return entity.getHeldItem().isEmpty();
    case "EARTHQUAKE":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:cryo_charge") == 1;
    default:
        return true;
    }
}
