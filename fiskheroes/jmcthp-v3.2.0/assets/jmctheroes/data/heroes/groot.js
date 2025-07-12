function init(hero) {
    hero.setName("Groot/Guardians Of The Galaxy Vol.3");
    hero.setAliases("tree", "groot");
    hero.setTier(7);
    
    hero.setHelmet("Head");
    hero.setChestplate("Chest");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");
    
    hero.addPowers("jmctheroes:groot");
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.75, 0);
    hero.addAttribute("PUNCH_DAMAGE", 11.4, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("WEAPON_DAMAGE", -0.75, 1);

    hero.addKeyBind("BLADE", "Toggle Claws", 1);

    hero.setDefaultScale(1.2);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:blade":
        return !entity.getData("fiskheroes:gliding");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "BLADE":
        return !entity.getData("fiskheroes:gliding");
    default:
        return true;
    }
}
