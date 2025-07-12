function init(hero) {
    hero.setName("Azazel/Prince Of Hell");
    hero.setTier(10);

    hero.setHelmet("Head");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPowers("dmh:prince_of_hell");

    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("KNOCKBACK", 0.25, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.35, 1);

    hero.addKeyBind("TELEKINESIS", "Telekinesis", 1);
    hero.addKeyBind("TELEKINESIS_AIM", "Telekinesis", 1);

    hero.addKeyBind("AIM", "Pyrokinesis", 2);
    hero.addKeyBind("AIM_VISUAL", "\u00A7mPyrokinesis", 2);
    hero.addKeyBindFunc("FIRE_AOE", (player, manager) => {
        if (!player.getData("dmh:dyn/fire") && player.getData("dmh:dyn/fire_timer") == 0) {
            manager.setData(player, "dmh:dyn/fire", true);
        }
        return true;
    }, "Pyrokinesis Field", 2);
    hero.addKeyBind("FIRE_AOE_VISUAL", "\u00A7mPyrokinesis Field", 2);

    hero.addKeyBind("SPELL_MENU", "Spell Casting", 3);

    hero.addKeyBind("TELEPORT", "Teleport", 4);

    hero.addSoundEvent("AIM_START", ["dmh:cgr/aim_on", "dmh:cgr/hellfire"]);
    hero.addSoundEvent("AIM_STOP", "dmh:cgr/aim_off");

    hero.setKeyBindEnabled(setKeyBindEnabled);
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isEmpty());
    hero.setHasProperty(hasProperty);
    hero.addDamageProfile("FIRE", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 1.0
        }
    });
    hero.addDamageProfile("FLAME", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 1.0
        },
        "properties": {
            "COOK_ENTITY": true,
            "IGNITE": 5,
            "HEAT_TRANSFER": 20
        }
    });

    hero.setTickHandler((entity, manager) => {
        if (entity.isSneaking()) {
        entity.world().getEntitiesInRangeOf(entity.pos(), 30).forEach(entityGrabbed => {
            var grabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
            if (entityGrabbed.isLivingEntity() && !entityGrabbed.equals(entity) && entityGrabbed.equals(grabbed)) {
                entityGrabbed.hurtByAttacker(hero, "FLAME", "%1$s was burned to death by %2$s.", 4, entity)
            }
        });
        }
        manager.incrementData(entity, "dmh:dyn/fire_timer", 40, 80, entity.getData("dmh:dyn/fire"));
        if (entity.getData("dmh:dyn/fire_timer") > 0.8 && entity.getData("dmh:dyn/fire")) {
            var list = entity.world().getEntitiesInRangeOf(entity.eyePos(), 6.0);
            list.forEach(other => {
                if (entity.canSee(other) && !entity.equals(other)) {
                    other.hurtByAttacker(hero, "FLAME", "%s Burned by %s flames", 25.0, entity);

                }
            });
            if (entity.getData("dmh:dyn/fire_timer") == 1) {
                manager.setData(entity, "dmh:dyn/fire", false);
            }

        }
    });
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function setKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "TELEKINESIS_AIM":
            return entity.getData("fiskheroes:grab_id") > -1;
        case "AIM":
            return !entity.isSneaking() && !entity.getData("fiskheroes:telekinesis") && entity.getHeldItem().isEmpty();
        case "AIM_VISUAL":
            return !entity.isSneaking() && entity.getData("fiskheroes:telekinesis") || !entity.isSneaking() && !entity.getHeldItem().isEmpty();
        case "FIRE_AOE":
            return entity.isSneaking() && !entity.getData("fiskheroes:telekinesis");
        case "FIRE_AOE_VISUAL":
            return entity.isSneaking() && entity.getData("fiskheroes:telekinesis");
        default:
            return true;
    }
}
