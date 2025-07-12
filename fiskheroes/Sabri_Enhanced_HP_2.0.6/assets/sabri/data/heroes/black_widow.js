var mech = implement("sabri:external/mechanics");

function init(hero) {
    hero.setName("Black Widow");
    hero.setTier(4);
    
    hero.setHelmet("item.superhero_armor.piece.hair");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sabri:dual_glock_26}", true, item => item.nbt().getString("WeaponType") == "sabri:dual_glock_26");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sabri:black_widow_batons}", true, item => item.nbt().getString("WeaponType") == "sabri:black_widow_batons");

    hero.addPowers("sabri:avengers_uniform_iii");
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 2.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 4.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 1);
    hero.addKeyBind("WIDOWS_BITE", "Toggle Widow's Bite", 1);
    hero.addKeyBindFunc("func_COMBINE_BATONS", batonsKey, "Combine Batons", 1);
    hero.addKeyBindFunc("func_SEPERATE_BATONS", batonsKey, "Seperate Batons", 1);
    hero.addKeyBind("GRAPPLE", "Grapple", 2);

    hero.setDefaultScale(0.9);

    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
    hero.addAttributeProfile("LANDING", landingProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setTickHandler((entity, manager) => {
        manager.setDataWithNotify(entity, "fiskheroes:web_swinging", entity.getData("sabri:dyn/grapple"));
        
        if (entity.getData("sabri:dyn/grapple") || !entity.getHeldItem().isEmpty()) {
            manager.setDataWithNotify(entity, "sabri:dyn/aiming", false);
        }

        if (entity.getData("sabri:dyn/baton_timer") == 1) {
            manager.setDataWithNotify(entity, "sabri:dyn/baton_change", false);
        }

        manager.incrementData(entity, "sabri:dyn/grapple_cooldown", 4, entity.getData("sabri:dyn/grapple") && entity.getData("fiskheroes:web_swinging_timer") == 0);
        manager.incrementData(entity, "sabri:dyn/baton_timer", 6, entity.getData("sabri:dyn/baton_change"));
        manager.incrementData(entity, "sabri:dyn/baton_cooldown", 1, 1);

        if (entity.getData("sabri:dyn/baton_timer") == 1) {
            var nbt = entity.getHeldItem().nbt();
            var weapontype = entity.getHeldItem().nbt().getString("WeaponType");
            var weapon = weapontype == "sabri:black_widow_batons" ? "sabri:black_widow_bo_staff" : "sabri:black_widow_batons"
            manager.setString(nbt, "WeaponType", weapon);

            if (weapontype == "sabri:black_widow_batons") {
                entity.playSound("sabri:suit.black_widow.batons.connect", 1, 1.1 - Math.random() * 0.2);
            } else {
                entity.playSound("sabri:suit.black_widow.batons.disconnect", 1, 1.1 - Math.random() * 0.2);
            }
        }

        mech.landing(entity, manager, entity.isSneaking(), false, -1, "sabri:suit.concrete_smash", 0.3, 1.3 - Math.random() * 0.3);
    });
}

function batonsKey(player, manager) {
    manager.setData(player, "sabri:dyn/baton_change", true);
    manager.setData(player, "sabri:dyn/baton_cooldown", 0);

    return true;
}

function hasPermission(entity, permission) {
    return permission == "USE_GUN" || permission == "USE_SHIELD";
}

function canAim(entity) {
    return entity.getHeldItem().isGun() || entity.getData("sabri:dyn/aiming") || entity.getHeldItem().nbt().getString("WeaponType") == "sabri:dual_glock_26";
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.isSneaking();
    case "fiskheroes:repulsor_blast":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "GRAPPLE":
    case "WIDOWS_BITE":
        return entity.getHeldItem().isEmpty();
    case "GUN_RELOAD":
        return (entity.getHeldItem().isGun() || entity.getHeldItem().nbt().getString("WeaponType") == "sabri:dual_glock_26") && !entity.getData("fiskheroes:aiming");
    case "func_COMBINE_BATONS":
        return entity.getHeldItem().nbt().getString("WeaponType") == "sabri:black_widow_batons" && entity.getData("sabri:dyn/baton_cooldown") == 1;
    case "func_SEPERATE_BATONS":
        return entity.getHeldItem().nbt().getString("WeaponType") == "sabri:black_widow_bo_staff" && entity.getData("sabri:dyn/baton_cooldown") == 1;
    default:
        return true;
    }
}

function landingProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("FALL_RESISTANCE", 6.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:dyn/superhero_landing_ticks") > 0 ? "LANDING" : null;
}