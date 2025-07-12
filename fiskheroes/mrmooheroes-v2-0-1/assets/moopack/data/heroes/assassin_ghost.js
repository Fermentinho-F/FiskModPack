var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Assassin");
    hero.setVersion("Ghost");
    hero.setTier(3);

    hero.setHelmet("item.superhero_armor.piece.hood");

    hero.addPowers("moopack:assassin_ghost_blade");
    hero.addPowers("moopack:assassin_ghost_suit");
    //hero.addAttribute("MAX_HEALTH", -6, 0);
    hero.addAttribute("FALL_RESISTANCE", 10.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);

    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fisktag:pistols}", false);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fisktag:rifle}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fisktag:sniper}", true);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fisktag:shotgun}", false);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fisktag:scatter_blaster}", false);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:fisktag:railgun}", false);
/*    hero.addPrimaryEquipment("fisktag:weapon", true);
    hero.setTickHandler((entity, manager) => {
        // equipment
        var nbt = entity.getWornHelmet().nbt();
        if (!nbt.getString("Complete")) {
            var nbt_string = "{WeaponType='fisktag:rifle'}";
            var equipment = manager.newTagList("[{Index:0,Item:{Count:" + 1 + ",Damage:" + 0 + ",id:" + 4169 + ", tag:{" + nbt_string + "}}}]");
            manager.setTagList(nbt, "Equipment", equipment);
            manager.setString(nbt, "Complete", true);

        }
    });
*/
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("INTANGIBILITY", "key.intangibility", 1);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 2);
    hero.addKeyBind("SUIT_ACTIVE", "Activate Suit", 5);
    hero.addKeyBind("OFF", "Deactivate Suit", 5);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setHasPermission((entity, permission) => permission === "USE_FISKTAG_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().name() === "fisktag:weapon");
    hero.supplyFunction("fisktagScroll", entity => true);

	hero.addSoundEvent("PUNCH", "fisktag:assassin_slash");

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);

    hero.setTickHandler((entity, manager) => {
        manager.setData(entity, "fiskheroes:blade", entity.getHeldItem().isEmpty());

        utils.flightOnIntangibility(entity, manager);
    });
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "INTANGIBILITY":
            return entity.getData("moopack:dyn/phase_active");
        case "INVISIBILITY":
            return entity.getData("moopack:dyn/phase_active");
    case "OFF":
        return entity.getData("moopack:dyn/phase_active");
        default:
            return true;
    }
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:intangibility":
            return entity.getData("moopack:dyn/phase_active") && !entity.getData("fiskheroes:invisible");
        case "fiskheroes:invisibility":
            return entity.getData("moopack:dyn/phase_active") && !entity.getData("fiskheroes:intangible");
        case "fiskheroes:controlled_flight":
            return entity.getData("moopack:dyn/phase_active") && entity.getData("fiskheroes:intangible");
        default:
            return true;
    }
}

function bladeProfile(profile) {
    profile.inheritDefaults();
    //profile.addAttribute("MAX_HEALTH", -6, 0);
    profile.addAttribute("PUNCH_DAMAGE", 9.0, 0);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:blade") && entity.isAlive() ? "BLADE" : null;
}
