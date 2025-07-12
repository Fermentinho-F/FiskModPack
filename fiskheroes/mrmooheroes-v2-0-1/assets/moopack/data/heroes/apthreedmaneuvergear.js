function init(hero) {
    hero.setName("Anti-Personnel 3D Maneuver Gear");
    hero.setTier(2);

    hero.setChestplate("Vest");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("moopack:apthreedmaneuvergear");
    hero.addAttribute("FALL_RESISTANCE", 11.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.15, 1);
    hero.addAttribute("IMPACT_DAMAGE", 0.5, 1);
    hero.addAttribute("WEAPON_DAMAGE", 6.5, 0);

    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:moopack:antititansword}", true);
    //hero.addPrimaryEquipment("fisktag:weapon{WeaponType:moopack:antititansword, AttributeModifiers:[{Operation:0,UUIDLeast:1,UUIDMost:1,Amount:5.5,AttributeName:generic.attackDamage,Name:Attack Damage}]}", true, item => item.nbt().getString("WeaponType") == 'moopack:antititansword');
    hero.setHasPermission((entity, permission) => permission === "USE_SWORD");

    //hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fisktag:pistols}", true);
    //hero.addPrimaryEquipment("fisktag:weapon{WeaponType:moopack:antititansword}", true);
    //hero.setHasPermission((entity, permission) => permission === "USE_FISKTAG_GUN" || permission == "USE_GUN");
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    //hero.supplyFunction("canAim", entity => entity.getHeldItem().name() === "fisktag:weapon" || entity.getHeldItem().isGun());
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());

    hero.addPrimaryEquipment("fiskheroes:beretta_93r{Dual:1}", true, item => item.nbt().getBoolean("Dual"));
    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    //hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    //hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "key.reload", 3);
    hero.addKeyBind("WEB_ZIP", "Grapple Pull", 1);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "Toggle Grappling", 2);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("SWORD", swordProfile);
    hero.setDamageProfile(getDamageProfile);
    hero.addDamageProfile("SWORDS", {
        "types": {
            "SHARP": 1.0
        }
    });
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:gliding", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function webWingsKey(player, manager) {
    if (player.isOnGround() || player.isInWater()) {
        return false;
    }

    var flag = player.getData("fiskheroes:gliding");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
        manager.setDataWithNotify(player, "fiskheroes:web_swinging", false);
    }

    manager.setDataWithNotify(player, "fiskheroes:gliding", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.getData("fiskheroes:gliding");
    case "fiskheroes:web_zip":
        return !entity.getData("fiskheroes:gliding");
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    case "fiskheroes:gliding":
        return !entity.getData("fiskheroes:web_swinging") && entity.getData("fiskheroes:utility_belt_type") == -1 && !entity.as("PLAYER").isUsingItem();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return !entity.getData("fiskheroes:gliding");
    case "WEB_ZIP":
        return !entity.getData("fiskheroes:gliding");
    default:
        return true;
    }
}

function getDamageProfile(entity) {
    if (entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == "moopack:antititansword") {
        return "SWORDS";
    }
}

function swordProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 6.5, 0);
}

function getProfile(entity) {
    if (entity.getHeldItem().name() == 'fisktag:weapon' && entity.getHeldItem().nbt().getString('WeaponType') == "moopack:antititansword") {
        return "SWORD";
    }
}