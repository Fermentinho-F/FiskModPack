function init(hero) {
    hero.setName("Mutant DNA");
    hero.setTier(1);

    hero.setChestplate("Syringe");

    hero.addPowers("moopack:mutant_dna");

    hero.addKeyBind("TELEPORT", "Teleport", 1);
    hero.addKeyBind("SHADOWFORM", "Shadow Form", 2);

    hero.setModifierEnabled(isModifierEnabled);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:shadowform");
    default:
        return true;
    }
}