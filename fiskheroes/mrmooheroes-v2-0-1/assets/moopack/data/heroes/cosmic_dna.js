function init(hero) {
    hero.setName("Cosmic DNA");
    hero.setTier(1);
    
    hero.setChestplate("Syringe");

    hero.addPowers("moopack:cosmic_dna");

    hero.addKeyBind("CHARGED_BEAM", "Cosmic Beam", 1);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 2);
    hero.addKeyBind("SHIELD", "Forcefield", 3);

}