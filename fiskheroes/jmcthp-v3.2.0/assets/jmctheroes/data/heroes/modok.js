function init(hero) {
    hero.setName("M.O.D.O.K.");
    hero.setVersion("item.superhero_armor.version.comics");
    hero.setTier(7);
    
    hero.setChestplate("Suit");
    
    hero.addPowers("jmctheroes:modok");
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.45, 1);
    hero.addAttribute("WEAPON_DAMAGE", -1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("STEP_HEIGHT", 0.5, 0);

    hero.addKeyBind("ENERGY_PROJECTION", "Energy Beam", 1);
    hero.addKeyBind("TELEKINESIS", "key.telekinesis", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.addSoundEvent("EQUIP", "jmctheroes:booster_loop");

    hero.setTickHandler((entity, manager) => {
        if (!entity.isOnGround()){
            manager.setData(entity, "fiskheroes:flying", true);
        }
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:energy_projection":
        return entity.getInterpolatedData("fiskheroes:flight_boost_timer") < 0.1 && !entity.getData("fiskheroes:telekinesis");
    case "fiskheroes:propelled_flight":
        return entity.isOnGround();
    default:
        return true;
    }
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "ENERGY_PROJECTION":
        return entity.getInterpolatedData("fiskheroes:flight_boost_timer") < 0.1 && !entity.getData("fiskheroes:telekinesis");
    default:
        return true;
    }
}