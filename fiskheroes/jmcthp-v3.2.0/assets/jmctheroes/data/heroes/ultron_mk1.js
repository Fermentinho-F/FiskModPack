function init(hero) {
    hero.setName("Ultron/Mark 1");
    hero.setAliases("ultronmk1", "crippled");
    hero.setTier(2);
    hero.setHelmet("Head");
    hero.setChestplate("Chestpiece");
    hero.setLeggings("Legs");
    hero.setBoots("Feet");
    
    hero.addPowers("jmctheroes:damaged_iron_legion_armor");
    hero.addAttribute("JUMP_HEIGHT", -1.5, 1);
    hero.addAttribute("BASE_SPEED", -0.5, 1);
    hero.addAttribute("SPRINT_SPEED", -0.1, 1);

    hero.addKeyBind("AIM", "key.aim", 1);

    hero.supplyFunction("canAim", canAim);
    
    hero.addSoundEvent("AIM_START", "fiskheroes:repulsor_charge");
    hero.addSoundEvent("AIM_STOP", "fiskheroes:repulsor_powerdown");
    hero.addSoundEvent("STEP", "fiskheroes:iron_man_walk");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}