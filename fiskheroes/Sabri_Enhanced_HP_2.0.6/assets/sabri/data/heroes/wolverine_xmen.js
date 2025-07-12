function init(hero) {
    hero.setName("Wolverine");
    hero.setVersion("X-Men");
    hero.setTier(6);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    
    hero.addPowers("sabri:adamantium_skeleton", "sabri:mutated_physiology", "fiskheroes:healing_factor");
    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 2.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);

    hero.addKeyBind("BLADE", "Toggle Claws", 1);
    hero.addKeyBind("SLOW_MOTION", "Slow-Motion Vision", 4);
    
    hero.addAttributeProfile("CLAWS", clawsProfile);
    hero.addAttributeProfile("STEP_CLAWS", stepClawsProfile);
    hero.addAttributeProfile("STEP", stepProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.addDamageProfile("CLAWS", {
        "types": {
            "SHARP": 1.0,
            "ADAMANTIUM": 1.0
        }
    });

    hero.addSoundEvent("PUNCH", "sabri:wolverine_xmen_slash");

    hero.setTickHandler((entity, manager) => {
        manager.incrementData(entity, "sabri:dyn/sprint_timer", 7, entity.isSprinting() && entity.isOnGround() && entity.getData("fiskheroes:blade_timer") > 0);

        manager.setData(entity, "fiskheroes:energy_projection", entity.getData("sabri:dyn/leap"));

        if  (entity.getData("fiskheroes:blade_timer") > 0 && entity.getData("sabri:dyn/sprint_timer") > 0.5 && entity.motionY() > 0.3 && !entity.isOnGround() && entity.getData("sabri:dyn/leap_timer") == 0) {
            manager.setDataWithNotify(entity, "sabri:dyn/leap", true);
        }
        else if  (entity.isOnGround() || entity.isInWater() || entity.getData("fiskheroes:blade_timer") == 0) {
            manager.setDataWithNotify(entity, "sabri:dyn/leap", false);
        }

        manager.incrementData(entity, "sabri:dyn/leap_timer", 12, entity.getData("sabri:dyn/leap"));

        if (entity.world().blockAt(entity.pos().add(0, 4 * entity.motionY(), 0)).isSolid() && entity.getData("fiskheroes:blade_timer") && entity.getData("sabri:dyn/leap") > 0 && !entity.isInWater()) {
            if (!entity.getData("sabri:dyn/roll")) {
                entity.playSound("sabri:suit.roll", 1, 1.15 - Math.random() * 0.3);
            }
            manager.setDataWithNotify(entity, "sabri:dyn/roll", true);
        }
        else if (entity.getData("sabri:dyn/roll_timer") == 1) {
            manager.setDataWithNotify(entity, "sabri:dyn/roll", false);
        }

        manager.incrementData(entity, "sabri:dyn/roll_timer", 14, entity.getData("sabri:dyn/roll"));
    });
}

function isKeyBindEnabled(entity, keyBind) {
    return entity.getHeldItem().isEmpty();
}

function clawsProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
}

function stepProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
}

function stepClawsProfile(profile) {
	profile.inheritDefaults();
	profile.addAttribute("STEP_HEIGHT", 0.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.4, 1);
    profile.addAttribute("PUNCH_DAMAGE", 10.5, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:blade") ? entity.getData("sabri:dyn/sprint_timer") ? "STEP_CLAWS" : "CLAWS" : entity.getData("sabri:dyn/sprint_timer") ? "STEP" : null
}

function isModifierEnabled(entity, modifier) {
    if (modifier.name() == "fiskheroes:leaping") {
        return modifier.id() == "sprint" == (entity.getData("fiskheroes:blade_timer") > 0 && entity.getData("sabri:dyn/sprint_timer") > 0.5 && entity.getData("sabri:dyn/leap_timer") == 0);
    }
    return true;
}