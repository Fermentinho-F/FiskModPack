var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("TheBigMooster");
    hero.setTier(1);

    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.torso");
    hero.setLeggings("item.superhero_armor.piece.legs");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("moopack:banana_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.1, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 1.0, 1);

    hero.addKeyBind("HEAT_VISION", "Banana Vision", 1);
    hero.addKeyBind("WEB_ZIP", "Peel Thwip", 2);
    hero.addKeyBindFunc("func_WEB_SWINGING", webSwingingKey, "Peel Swinging", 3);
    hero.addKeyBind("CHARGED_BEAM", "Ancient Banana Blast", 4);
    hero.addKeyBindFunc("func_GIANT_MODE", giantModeKey, "TheBIGMooster", 5);

    hero.setHasProperty((entity, property) => property == "BREATHE_SPACE");
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);

    hero.addAttributeProfile("GIANT_MODE", giantProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setTierOverride(getTierOverride);

    hero.addSoundEvent("AIM_START", "fiskheroes:mysterio_beam_aim");

    hero.setTickHandler((entity, manager) => {
        //utils.flightOnIntangibility(entity, manager);
    });
}

function giantModeKey(player, manager) {
    var flag = player.getData("fiskheroes:dyn/giant_mode");
    manager.setData(player, "fiskheroes:dyn/giant_mode", !flag);
    manager.setData(player, "fiskheroes:size_state", flag ? -1 : 1);
    return true;
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/giant_mode") ? 3 : 1;
}

function giantProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 7.5, 0);
    profile.addAttribute("SPRINT_SPEED", 0.25, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 1.0, 1);
}

function getAttributeProfile(entity) {
    return entity.getData("fiskheroes:dyn/giant_mode_timer") > 0 ? "GIANT_MODE" : null;
}

function webSwingingKey(player, manager) {
    var flag = player.getData("fiskheroes:web_swinging");

    if (!flag) {
        manager.setDataWithNotify(player, "fiskheroes:prev_utility_belt_type", player.getData("fiskheroes:utility_belt_type"));
        manager.setDataWithNotify(player, "fiskheroes:utility_belt_type", -1);
    }

    manager.setDataWithNotify(player, "fiskheroes:web_swinging", !flag);
    return true;
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_swinging":
        return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:utility_belt_type") == -1;
    case "fiskheroes:leaping":
        return modifier.id() == "springboard" == (entity.getData("fiskheroes:ticks_since_swinging") < 5);
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "func_WEB_SWINGING":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getData("fiskheroes:beam_charge") == 0 && entity.getData('fiskheroes:time_since_damaged') > 10;
}