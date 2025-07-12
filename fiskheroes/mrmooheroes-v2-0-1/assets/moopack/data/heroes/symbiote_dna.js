function init(hero) {
    hero.setName("Symbiote DNA");
    hero.setTier(1);

    hero.setChestplate("Syringe");

    hero.addPowers("moopack:symbiote_dna");

    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
    hero.addKeyBind("TENTACLES", "key.tentacles", 3);
}