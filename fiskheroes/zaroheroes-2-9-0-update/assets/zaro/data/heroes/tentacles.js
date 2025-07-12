function init(hero) {
    hero.setName("Doctor Octopus Tentacles");
    hero.setAliases("doc_ock", "ock");
    hero.setTier(2);

  
    hero.setChestplate("suit");
 
    hero.addPowers("zaro:mechanical");
    hero.addAttribute("FALL_RESISTANCE", 2.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 3.5, 0);

    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
    hero.addKeyBind("TENTACLE_STRIKE", "key.tentacleStrike", 3);
    hero.addKeyBind("TENTACLES", "key.tentacles", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
}

function isKeyBindEnabled(entity, keyBind) {
    return keyBind == "TENTACLES" || entity.getData("fiskheroes:tentacles") != null;
}
