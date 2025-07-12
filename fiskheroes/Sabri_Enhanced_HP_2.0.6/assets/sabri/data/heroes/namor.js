function init(hero) {
    hero.setName("Namor");
    hero.setTier(8);
    
    hero.setHelmet("Earrings");
    hero.setChestplate("Pectoral");
    hero.setLeggings("Trunks");
    hero.setBoots("Anklets");
    
    hero.addPowers("sabri:mutated_talokanil_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 10.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 4.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("FALL_RESISTANCE", 24.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.5, 1);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:sabri:vibranium_spear}", true, item => item.nbt().getString("WeaponType") == "sabri:vibranium_spear");

    for (var i = 0; i <= 50; i++) {
        hero.addAttributeProfile("DROUGHT_" + i, profile => {
            var m = i / 50;
            profile.addAttribute("PUNCH_DAMAGE", 10.5 - 8 * m, 0);
            profile.addAttribute("WEAPON_DAMAGE", 3.5 - 5.5 * m, 0);
            profile.addAttribute("JUMP_HEIGHT", 1.5 - 1.75 * m, 0);
            profile.addAttribute("FALL_RESISTANCE", 24.0 - 25.25 * m, 0);
            profile.addAttribute("SPRINT_SPEED", 0.5 - 0.5 * m, 1);
            profile.addAttribute("BASE_SPEED", 0 - 0.7 * m, 1);
        });
    }

    hero.setAttributeProfile(getProfile);
    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);

    hero.setTickHandler((entity, manager) => {
        manager.setData(entity, "sabri:dyn/dry", !entity.isWet());

        if (entity.hasPotionEffect(2) && entity.hasPotionEffect(9) && entity.hasPotionEffect(18)) {
            manager.setData(entity, "sabri:dyn/drought_timer", entity.getData("sabri:dyn/drought_timer") + 0.0015);
        }
        
        manager.incrementData(entity, "sabri:dyn/sneak_timer", 8, 6, entity.getHeldItem().nbt().getString("WeaponType") == "sabri:vibranium_spear" && (!entity.getData("fiskheroes:moving") && !entity.isPunching() || entity.getData("fiskheroes:flying") && entity.motionX() == 0 && entity.motionZ() == 0 && !entity.isPunching()));
        manager.incrementData(entity, "sabri:dyn/in_water", 6, 12, entity.isInWater());

        if (!entity.isSneaking() && entity.isInWater()) {
            manager.setData(entity, "fiskheroes:flying", true);
        }
    });
}

function isModifierEnabled(entity, modifier) {
    var drought = Math.round(10 * (1 - Math.pow(entity.getData("sabri:dyn/drought_timer"), 2)));

    switch (modifier.name()) {
        case "fiskheroes:fire_weakness":
            return !entity.isWet();
        case "fiskheroes:controlled_flight":
            return drought > 0 && modifier.id() == ("a" + drought);
        case "fiskheroes:regeneration":
            return modifier.id() == ("b" + drought);
        default:
            return true;
    }
}

function getTierOverride(entity) {
    var maxTier = 8;
    return (Math.ceil(maxTier * (1 - Math.pow(entity.getData("sabri:dyn/drought_timer"), 2))) | 0);
}

function getProfile(entity) {
    return "DROUGHT_" + Math.round(50 * Math.pow(entity.getData("sabri:dyn/drought_timer"), 2));
}