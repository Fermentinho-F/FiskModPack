var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("MrMoo");
    hero.setTier(1);

    hero.setChestplate("Milk Carton");

    hero.addPowers("moopack:milk_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    //hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBind("INVISIBILITY", "Vanish", 1);
    hero.addKeyBind("TENTACLE_JAB", "Milk Hand Punch", 2);
    hero.addKeyBind("TENTACLE_GRAB", "Milk Hand Grab", 3);
    hero.addKeyBind("TENTACLES", "Toggle Milk Hands", 4);

    hero.setDefaultScale(0.25);
}