var landing = implement("fiskheroes:external/superhero_landing");

function init(hero) {
    hero.setName("The Mandalorian");
    hero.setAliases("Bounty_Hunter");
    hero.setVersion("\u00A77\u00A7lBeskar Armor\u00A7r");
    hero.setTier(7);
    
    hero.setHelmet("Helmet");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:ib94", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:ib94");
    
    hero.addPowers("swhp:mandalorian_armor", "swhp:grogu", "swhp:mandalorian_jetpack", "swhp:lightsaber_darksaber");
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("KNOCKBACK", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.1, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.2, 1);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("LIGHTSABER", "Unholster Darksaber", 1);
    hero.addKeyBind("TENTACLES", "Summon Grogu", 1);
    hero.addKeyBind("HOLSTERLIGHTSABER", "Holster Darksaber", 1);
    hero.addKeyBind("LIGHTSABERIGNITE", "Ignite Darksaber", 2);
    hero.addKeyBind("SHIELD", "Ignite Darksaber", 2);
    hero.addKeyBind("LIGHTSABERRETRACT", "Retract Darksaber", 2);
    hero.addKeyBind("WEB_ZIP", "Wrist Grapple", 3);
    hero.addKeyBind("CHARGED_BEAM", "FlameThrower", 4);
    hero.addKeyBind("UTILITY_BELT", "Gadgets", 5);
    
    hero.setDefaultScale(1.0);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("LIGHTSABER", lightsaberProfile);
    hero.addAttributeProfile("LIGHTSABERIGNITE", lightsaberigniteProfile);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);

    hero.setDamageProfile(entity => entity.getData("swhp:dyn/lightsaber") ? "LIGHTSABER" : null);
    hero.addDamageProfile("LIGHTSABER", {
        "types": {
            "ENERGY": 1.0
        }
    });

    hero.addSoundEvent("MASK_OPEN", "swhp:voicelines_mandalorian");
    hero.addSoundEvent("PUNCH", "swhp:darksaber_swing");

    hero.setTickHandler((entity, manager) => {
        var flying = entity.getData("fiskheroes:flying");
        manager.incrementData(entity, "fiskheroes:dyn/booster_timer", 2, flying);

        var item = entity.getHeldItem();
        flying &= !entity.as("PLAYER").isUsingItem();
        manager.incrementData(entity, "fiskheroes:dyn/booster_r_timer", 2, flying && item.isEmpty() && !entity.isPunching() && entity.getData("fiskheroes:aiming_timer") == 0);
        manager.incrementData(entity, "fiskheroes:dyn/booster_l_timer", 2, flying && !item.doesNeedTwoHands());

        landing.tick(entity, manager);
    });
}

function hasProperty(entity, property) {
    return property == "BREATHE_SPACE" || property == "MASK_TOGGLE";
}

function canAim(entity) {
    return (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:ambanphasepulseblaster") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:ib94");
}

function hasPermission(entity, permission) {
    return (permission == "USE_AMBANPHASE") || (permission == "USE_IB94");
}

function lightsaberProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    profile.addAttribute("SPRINT_SPEED", -0.05, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.95, 0);
}

function lightsaberigniteProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.75, 0);
    profile.addAttribute("SPRINT_SPEED", -0.1, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.95, 0);
}

function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("BASE_SPEED", -0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", -1.0, 0);
}

function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:shield_blocking")) {
        return "SHIELD";
    }
    if (entity.getData("swhp:dyn/lightsaberignite")) {
        return "LIGHTSABERIGNITE";
    }
    if (entity.getData("swhp:dyn/lightsaber")) {
        return "LIGHTSABER";
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "swhp:dyn/lightsaberignite":
        return entity.getData("swhp:dyn/lightsaber");
    case "fiskheroes:shield":
        return entity.getData("swhp:dyn/lightsaber");
    case "fiskheroes:web_zip":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "HOLSTERLIGHTSABER":
            return !entity.isSneaking() && entity.getHeldItem().isEmpty() && entity.getData("swhp:dyn/lightsaber") && entity.getData("swhp:dyn/lightsaberignite_timer") == 0;
        case "LIGHTSABER":
            return !entity.isSneaking() && entity.getHeldItem().isEmpty() && entity.getData("swhp:dyn/lightsaberignite_timer") == 0;
        case "TENTACLES":
            return entity.isSneaking();
        case "LIGHTSABERRETRACT":
            return entity.getData("swhp:dyn/lightsaber") && (entity.getData("swhp:dyn/lightsaberignite"));
        case "LIGHTSABERIGNITE":
            return entity.getData("swhp:dyn/lightsaber");
        case "SHIELD":
            return entity.getData("swhp:dyn/lightsaber");
        case "WEB_ZIP":
            return entity.getHeldItem().isEmpty();
        default:
            return true;
    }
}