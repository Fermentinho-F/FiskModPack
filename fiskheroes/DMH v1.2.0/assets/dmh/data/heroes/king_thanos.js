function init(hero) {
    hero.setName("King Thanos");
    hero.setTier(10);

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestplate");
    hero.setLeggings("item.superhero_armor.piece.leggings");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("dmh:titanian_eternal_physiology", "dmh:titanian_energy_manipulation", "dmh:twilight_sword");

    hero.addAttribute("PUNCH_DAMAGE", 15.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.75, 1);
    hero.addAttribute("BASE_SPEED", 1, 1);
    hero.addAttribute("SPRINT_SPEED", 1, 1);
    hero.addAttribute("IMPACT_DAMAGE", 20, 0);
    hero.addAttribute("FALL_RESISTANCE", 1, 1);

    hero.addKeyBind("DONT_PUNCH", "Dont Punch", -1);
    hero.addKeyBind("TELEPORT", "Teleport", 3);
    hero.addKeyBind("SHIELD", "Forcefield", 3);
    hero.addKeyBind("SHIELD_VISUAL", "\u00A7mForcefield", 3);

    hero.addKeyBind("ENERGY_PROJECTION", "Energy Projection", 1);
    hero.addKeyBind("ENERGY_PROJECTION_VISUAL", "\u00A7mEnergy Projection", 1);


    hero.addKeyBind("TELEKINESIS", "Telekinesis", 4);
    hero.addKeyBind("TELEKINESIS_VISUAL", "\u00A7mTelekinesis", 4);

    hero.addKeyBind("IGNITE", "Ignite Twilight Sword", 5);
    hero.addKeyBind("IGNITE_VISUAL", "\u00A7mIgnite Twilight Sword", 5);

    hero.addKeyBind("BLADE", "Draw Twilight Sword", 2);
    hero.addKeyBind("BLADE_VISUAL", "\u00A7mDraw Twilight Sword", 2);

    hero.setKeyBindEnabled(getKeyBindEnabled);
    hero.setModifierEnabled(getModifierEnabled);

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "dmh:dyn/equip_timer", 10, entity.getData("fiskheroes:blade"));
        if (entity.getData("dmh:dyn/ignite") && !entity.getData("fiskheroes:blade")) {
            manager.setData(entity, "dmh:dyn/ignite", false);
        }

        var t = entity.getData("fiskheroes:dyn/superhero_landing_ticks");

        if (t == 0 && !entity.isSprinting() && !entity.isOnGround() && entity.motionY() < -1.25 && entity.getData("fiskheroes:flight_boost_timer") > 0 && entity.world().blockAt(entity.pos().add(0, -2, 0)).isSolid()) {
            manager.setDataWithNotify(entity, "fiskheroes:dyn/superhero_landing_ticks", t = 12);
            entity.playSound("fiskheroes:suit.antimonitor.forcefield.deflect", 1, 1.15 - Math.random() * 0.3);
        }
        else if (t > 0) {
            manager.setData(entity, "fiskheroes:dyn/superhero_landing_ticks", --t);
        }
    
        manager.incrementData(entity, "fiskheroes:dyn/superhero_landing_timer", 2, 8, t > 0);
    });

    hero.setDefaultScale(2);

    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("SWORD", swordProfile);
    hero.setAttributeProfile(getAttributeProfile);


    hero.addDamageProfile("SWORD", {
        "types": {
            "SHARP": 1.0
        }
    });
    hero.addDamageProfile("IGNITE", {
        "types": {
            "SHARP": 1.0,
            "FIRE": 1.0
        },
        "properties": {
            "COOK_ENTITY": true,
            "IGNITE": 10,
            "HEAT_TRANSFER": 40
        }
    });
    hero.setDamageProfile(getDamageProfile);

    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE" || (entity.as("DISPLAY").getDisplayType() == "DISPLAY_STAND" ? property == "MASK_TOGGLE" : false));

}

function getKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "DONT_PUNCH":
        return entity.getData("dmh:dyn/equip_timer") > 0 && entity.getData("dmh:dyn/equip_timer") < 1 || entity.getData("fiskheroes:energy_projection_timer") > 0;
    case "IGNITE_VISUAL":
        return entity.getData("dmh:dyn/equip_timer") == 1 && entity.getData("fiskheroes:energy_projection_timer") > 0;
    case "IGNITE":
        return entity.getData("dmh:dyn/equip_timer") == 1 && entity.getData("fiskheroes:energy_projection_timer") == 0;
    case "BLADE":
        return (entity.getData("dmh:dyn/equip_timer") == 0 || entity.getData("dmh:dyn/equip_timer") == 1) && !entity.getData("fiskheroes:energy_projection");
    case "BLADE_VISUAL":
        return entity.getData("dmh:dyn/equip_timer") > 0 && entity.getData("dmh:dyn/equip_timer") < 1 || entity.getData("fiskheroes:energy_projection");
    case "TELEKINESIS":
        return !entity.getData("fiskheroes:energy_projection");
    case "TELEKINESIS_VISUAL":
        return entity.getData("fiskheroes:energy_projection");
    case "TELEPORT":
        return !entity.isSneaking();
    case "ENERGY_PROJECTION":
        return (entity.getData("dmh:dyn/equip_timer") == 0 || entity.getData("dmh:dyn/equip_timer") == 1) && entity.getData("fiskheroes:grab_id") == -1 && !entity.getData("fiskheroes:shield");
    case "ENERGY_PROJECTION_VISUAL":
        return entity.getData("dmh:dyn/equip_timer") > 0 && entity.getData("dmh:dyn/equip_timer") < 1 || entity.getData("fiskheroes:grab_id") > -1 || entity.getData("fiskheroes:shield");
    case "SHIELD":
        return !entity.getData("fiskheroes:energy_projection") && entity.isSneaking();
    case "SHIELD_VISUAL":
        return entity.getData("fiskheroes:energy_projection") && entity.isSneaking();
    default:
        return true;
    }
}

function getModifierEnabled(entity, modifier) {
    var id = modifier.id();
    switch (modifier.name()) {
    case "fiskheroes:energy_projection":
        return entity.getData("dmh:dyn/ignite") ? id == "fire" : id == "normal";
    default:
        return true;
    }
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.75, 1);
    profile.addAttribute("JUMP_HEIGHT", -4, 1);
}

function swordProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 23.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:shield_blocking") ? "SHIELD" : entity.getData("dmh:dyn/equip_timer") == 1 ? "SWORD" : null;
}

function getDamageProfile(entity) {
    return entity.getData("dmh:dyn/equip_timer") == 1 ? entity.getData("dmh:dyn/ignite") ? "IGNITE" : "SWORD" : null;
}
