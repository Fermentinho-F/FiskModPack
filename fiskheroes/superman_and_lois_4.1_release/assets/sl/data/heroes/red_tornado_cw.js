var moonFly = implement("sl:external/moon_fly");

function init(hero) {
    hero.hide();
    hero.setName("Red Tornado");
    hero.setTier(7);
    hero.setDefaultScale(1.1);
    hero.setHelmet("Mask");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("sl:wind_manipulation");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);

    hero.addKeyBind("CHARGED_BEAM", "Generate Wind", 1);

hero.setTickHandler((entity, manager) => {
  moonFly.moonFly(entity, manager);
});

}