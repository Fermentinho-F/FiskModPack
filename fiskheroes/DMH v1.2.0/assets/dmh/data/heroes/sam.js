function init(hero) {
    hero.setName("Sam Winchester/Special Child & Hunter");
    hero.setTier(6);

    hero.setHelmet("Head");
    hero.setChestplate("Jacket");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPrimaryEquipment("fiskheroes:desert_eagle", true);
    hero.addPrimaryEquipment("fiskheroes:beretta_93r", true);
    hero.addPrimaryEquipment("fiskheroes:scimitar", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:dmh:angel_blade}", true, item => item.nbt().getString("WeaponType") == "dmh:angel_blade");

    hero.addPowers("dmh:hunting", "dmh:special_child");


    hero.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.05, 1);
    hero.addAttribute("KNOCKBACK", 0.05, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.15, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 1);
    hero.addKeyBind("TELEKINESIS_AIM", "Telekinesis", 1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 2);


    hero.setKeyBindEnabled(setKeyBindEnabled);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
    hero.setHasProperty(hasProperty);
    hero.addDamageProfile("HURT", {
        "types": {
            "BLUNT": 1.0
        }
    });
    hero.setTickHandler((entity, manager) => {
        if (entity.isSneaking()) {
            entity.world().getEntitiesInRangeOf(entity.pos(), 30).forEach(entityGrabbed => {
                var grabbed = entity.world().getEntityById(entity.getData("fiskheroes:grab_id"));
                if (entityGrabbed.isLivingEntity() && !entityGrabbed.equals(entity) && entityGrabbed.equals(grabbed)) {
                    entityGrabbed.hurtByAttacker(hero, "HURT", "%1$s was squeezed to death by %2$s.", 4, entity)
                }
            });
        }
    });
}

function hasPermission(entity, permission) {
    return permission == "USE_GUN" || "ANGEL_BLADE";
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function setKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "GUN_RELOAD":
            return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
        case "TELEKINESIS_AIM":
            return entity.getData("fiskheroes:grab_id") > -1;
        default:
            return true;
    }
}