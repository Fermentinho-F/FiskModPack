var dome = implement("shadows:external/shadow_dome");
var suit = implement("shadows:external/return_to_random");

function init(hero) {
    hero.setName("Shadow");
    hero.setTier(6);

    hero.setHelmet("item.superhero_armor.piece.hood");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("shadows:advanced_umbrakinesis");

    hero.addAttribute("PUNCH_DAMAGE", 5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3, 0);
    hero.addAttribute("JUMP_HEIGHT", 1, 0);
    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("IMPACT_DAMAGE", 2, 1);

    hero.addKeyBind("SHADOWFORM", "key.shadowForm", 1);
    hero.addKeyBind("TENTACLE_JAB", "key.tentacleJab", 1);
    hero.addKeyBind("TENTACLE_GRAB", "key.tentacleGrab", 2);
    hero.addKeyBind("SHADOWDOME", "key.shadowDome", 3);
    hero.addKeyBind("TENTACLES", "key.tentacles", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setTickHandler((entity, manager) => {
        if (entity.getWornChestplate().nbt().getFloat("Upgrades") == 594 && !entity.getData("shadows:dyn/1boolean_reset")) {
            manager.setData(entity, "shadows:dyn/1boolean_reset", true);
        } else if (entity.getWornChestplate().nbt().getFloat("Upgrades") != 594) {
            manager.setData(entity, "shadows:dyn/1boolean_reset", dome.isEntityInTheirOwnDome(entity));
        }
        if (entity.getData("fiskheroes:flying") && entity.getData('fiskheroes:flight_timer') > 0.5 || !entity.getData("fiskheroes:flying") && entity.getData('fiskheroes:flight_timer') > 0) {
            var flap = entity.getData("shadows:dyn/2float_interp_reset");
            manager.setData(entity, "shadows:dyn/2float_interp_reset", entity.getData('fiskheroes:flight_timer') > 0 ? entity.getData("fiskheroes:flight_boost_timer") > 0.5 ? flap + 0.05 : flap + 0.1 : 0);
        }
        // return to random
        suit.returnSuit(entity, manager);
    });

}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return !entity.getData("fiskheroes:shadowform") && entity.getData("fiskheroes:tentacles") == null;
    case "fiskheroes:flight":
        return entity.getData("fiskheroes:shadowform");
    case "fiskheroes:tentacles":
        return !entity.getData("fiskheroes:shadowform");
    case "fiskheroes:shadowform":
        return entity.getData("shadows:dyn/1boolean_reset");
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHADOWFORM":
        return entity.getData("fiskheroes:tentacles") == null && entity.getData("shadows:dyn/1boolean_reset");
    case "SHADOWDOME":
        return entity.getData("fiskheroes:tentacles") == null && !entity.getData("fiskheroes:shadowform");
    case "TENTACLE_GRAB":
        return entity.getData("fiskheroes:tentacles") != null;
    case "TENTACLE_JAB":
        return entity.getData("fiskheroes:tentacles") != null;
    case "TENTACLES":
        return !entity.getData("fiskheroes:shadowform");
    default:
        return true;
    }
}
