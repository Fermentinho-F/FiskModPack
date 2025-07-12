var radius = implement("shadows:external/radius");
function init(hero) {
    hero.setName("Vampire Hunter");
    hero.setTier(2);

    hero.setHelmet("Hat");

    hero.addPowers("shadows:hunter");

    hero.addAttribute("FALL_RESISTANCE", 1, 1);
    hero.addAttribute("PUNCH_DAMAGE", 6.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 3.5, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.2, 1);
    hero.addAttribute("STEP_HEIGHT", 1, 0);
    hero.addAttribute("BOW_DRAWBACK", 0.65, 1);

    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:shadows:stake}", true, item => item.nbt().getString("WeaponType") == "shadows:stake");
    hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:0}", true, item => !item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:shadows:cross}", true, item => item.nbt().getString("WeaponType") == "shadows:cross");

    hero.addKeyBind("DISABLE_PUNCH", "Disable Punch", -1);
    hero.addKeyBind("AIM", "Aim", -1);
    hero.addKeyBindFunc("AMMO", (entity, manager) => {
        var nbt = entity.getHeldItem().nbt()
            if (entity.getHeldItem().isGun()) {
                manager.setShort(nbt, "AmmoType", 13510);
                manager.setShort(nbt, "Ammo", 8);
                manager.setData(entity, "shadows:dyn/reload", true);
                entity.playSound("shadows:hunter.reload", 0.5, 1);
            }

            return true;
    }, "key.reload", 1);

    hero.addKeyBind("QUIVER_CYCLE", "key.quiverCycle", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 2);

    hero.supplyFunction("canAim", entity => {
        var weapon = entity.getHeldItem().nbt().getString("WeaponType");
        return entity.getHeldItem().isGun() || entity.getHeldItem().name() === "fisktag:weapon" && weapon == "shadows:cross" && (entity.getData("shadows:dyn/holy") == 0 || entity.getData("fiskheroes:aiming"));
    });

    hero.addSoundEvent("AIM_START", "shadows:hunter/holy_ray_loop");

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:aiming_timer") == 1 && entity.getHeldItem().name() === 'fisktag:weapon') {
            var vampire = radius.lookingAtVampire(entity);
            if (vampire != null) {
                vampire.hurtByAttacker(hero, "HOLY", "%s Died from %s's Holy Cross", 1.0, entity);
            }
        }
        if (entity.getData("shadows:dyn/holy") == 1 && entity.getHeldItem().name() === 'fisktag:weapon') {
            manager.setData(entity, "fiskheroes:aiming", false);
        }
    });

    hero.addAttributeProfile("SLOWER", profile => {
        profile.inheritDefaults();
        profile.addAttribute("BASE_SPEED", -0.2, 1);
        profile.addAttribute("SPRINT_SPEED", 0, 1);
    });
    hero.addAttributeProfile("STAKE", profile => {
        profile.inheritDefaults();
        profile.addAttribute("PUNCH_DAMAGE", 4, 0);
    });
    hero.addDamageProfile("STAKE", {
        "types": {
            "STAKE": 1.0
        }
    });
    hero.addDamageProfile("HOLY", {
        "types": {
            "HOLY": 1.0
        },
        "properties": {
            "REDUCE_KNOCKBACK": 1
        }
    });
    hero.setAttributeProfile(getAttributeProfile);
    hero.setKeyBindEnabled(getKeybindEnabled);
    hero.setDamageProfile((entity) => entity.getHeldItem().nbt().getString("WeaponType") == "shadows:stake" ? "STAKE" : null);

    hero.setHasPermission((entity, permission) => permission === "USE_CROSS" || permission === "USE_STAKE" || permission == "USE_GUN");
}

function getAttributeProfile(entity) {
    switch (true) {
    case entity.getData("fiskheroes:aiming"):
        return "SLOWER";
    case entity.getHeldItem().nbt().getString("WeaponType") == "shadows:stake":
        return "STAKE"
    default:
        return null;
    }
}

function getKeybindEnabled(entity, keyBind) {
    var weapon = entity.getHeldItem().nbt().getString("WeaponType");
    switch (keyBind) {
    case "AMMO":
        return entity.getData("shadows:dyn/reload") == 0 && entity.getHeldItem().nbt().getShort("Ammo") == 0 && entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming");
    case "DISABLE_PUNCH":
    case "AIMING":
        return entity.getHeldItem().name() === "fisktag:weapon" && weapon == "shadows:cross";
    case "HORIZONTAL_BOW":
        return entity.getHeldItem().name() === "fiskheroes:compound_bow" && entity.getData("fiskheroes:equipped_quiver") != null
    case "QUIVER_CYCLE":
        return entity.getHeldItem().name() === "fiskheroes:compound_bow";
    default:
        return true;
    }

}
