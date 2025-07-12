var blackslash = implement("tmhp:external/blackslash");
function init(hero) {
    hero.setName("Asta/\u00A7c\u00A7lAP 9");
    hero.setVersion("Black Clover:Spade Saga");
    hero.setTier(9);
    
    hero.setHelmet("Headband");
    hero.setChestplate("Jacket");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    /*hero.addPrimaryEquipment("fiskheroes:katana", true, item => !item.nbt().getBoolean("Dual"));*/
    
    hero.addPowers("tmhp:anti_mahou", "tmhp:devil_union", "tmhp:speed_force", "fiskheroes:energy_manipulation");
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.7, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.8, 1);
    
    hero.addKeyBind("SHIELD", "Crimson Spine", 1);
    hero.addKeyBind("CHARGE_ENERGY", "Black Slash", 5);
    hero.addKeyBind("CHARGED_BEAM", "Infinity Slash:Equinox", 5);
    hero.addKeyBind("BLADE", "Demon Dweller Sword", 2);
    hero.addKeyBind("CHARGE_ICE", "Charge Black Divider", 2);
    hero.addKeyBind("SLOW_MOTION", "key.slowMotion", 3);
    hero.addKeyBind("BLACKFORM2", "Toggle Semi Form", 4);
    hero.addKeyBind("DEVILUNION", "Toggle True Form", 4);
    
    
    hero.setTierOverride(getTierOverride);
    hero.setTickHandler((entity, manager) => {
        blackslash.blackslash(entity, manager);
    });

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("BLACKSHIELD", blackshieldProfile);
    hero.addAttributeProfile("UNIONSHIELD", unionshieldProfile);

    hero.addAttributeProfile("BLADE", bladeProfile);
    hero.addAttributeProfile("BLACKBLADE", blackbladeProfile);
    hero.addAttributeProfile("UNIONBLADE", unionbladeProfile);

    hero.addAttributeProfile("KATANA", katanaProfile);
    hero.addAttributeProfile("BLACKKATANA", blackkatanaProfile);
    hero.addAttributeProfile("BLACKSAMURAI", blacksamuraiProfile);
    hero.setAttributeProfile(getProfile);
    hero.setDamageProfile(getProfile);
    hero.addDamageProfile("SHIELD", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 10,
                    "amplifier": 1 } ] } });
    hero.addDamageProfile("BLACKSHIELD", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 25,
                    "amplifier": 1 } ] } });
    hero.addDamageProfile("UNIONSHIELD", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 50,
                    "amplifier": 1 } ] } });

    hero.addDamageProfile("BLADE", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 10,
                    "amplifier": 1 } ] } });
    hero.addDamageProfile("BLACKBLADE", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 25,
                    "amplifier": 1 } ] } });
    hero.addDamageProfile("UNIONBLADE", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 50,
                    "amplifier": 1 } ] } });

    hero.addDamageProfile("KATANA", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 10,
                    "amplifier": 1 } ] } });
    hero.addDamageProfile("BLACKKATANA", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 25,
                    "amplifier": 1 } ] } });
    hero.addDamageProfile("BLACKSAMURAI", {
        "properties": {"EFFECTS": [{
                    "id": "fiskheroes:tutridium",
                    "duration": 50,
                    "amplifier": 1 } ] } });
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 50.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
    profile.addAttribute("REACH_DISTANCE", 3.0, 0);
}
function blackshieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 100.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 30.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("REACH_DISTANCE", 3.0, 0);
}
function unionshieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 200.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 50.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("REACH_DISTANCE", 3.0, 0);
}
function bladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
}
function blackbladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 30.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 20.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.7, 0);
}
function unionbladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 50.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 40.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.7, 0);
}
function katanaProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", 1.2, 1);
    profile.addAttribute("WEAPON_DAMAGE", 5.0, 0);
}
function blackkatanaProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", 2.4, 1);
    profile.addAttribute("WEAPON_DAMAGE", 25.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 10.0, 0);
}
function blacksamuraiProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", 3.0, 1);
    profile.addAttribute("WEAPON_DAMAGE", 45.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 30.0, 0);
}
function getProfile(entity) {
    if (entity.getData("fiskheroes:blade") && !entity.getData("tmhp:dyn/blackform2") && !entity.getData("tmhp:dyn/devil_union")) {
        return "BLADE";
    }
    else if (entity.getData("tmhp:dyn/blackform2") && !entity.getData("tmhp:dyn/devil_union") && entity.getData("fiskheroes:blade")) {
        return "BLACKBLADE";
    }
    else if (!entity.getData("tmhp:dyn/blackform2") && entity.getData("tmhp:dyn/devil_union") && entity.getData("fiskheroes:blade")) {
        return "UNIONBLADE";
    }

    else if (!entity.getData("tmhp:dyn/devil_union") && entity.getData("fiskheroes:shield") && !entity.getData("tmhp:dyn/blackform2")) {
        return "SHIELD";
    }
    else if (!entity.getData("tmhp:dyn/devil_union") && entity.getData("tmhp:dyn/blackform2") && entity.getData("fiskheroes:shield")) {
        return "BLACKSHIELD";
    }
    else if (entity.getData("tmhp:dyn/devil_union") && !entity.getData("tmhp:dyn/blackform2") && entity.getData("fiskheroes:shield")) {
        return "UNIONSHIELD";
    }

    else if (!entity.getData("tmhp:dyn/devil_union") && !entity.getData("tmhp:dyn/blackform2") && entity.getHeldItem().name() == "fiskheroes:katana") {
        return "KATANA";
    }
    else if (!entity.getData("tmhp:dyn/devil_union") && entity.getData("tmhp:dyn/blackform2") && entity.getHeldItem().name() == "fiskheroes:katana") {
        return "BLACKKATANA";
    }
    else if (entity.getData("tmhp:dyn/devil_union") && !entity.getData("tmhp:dyn/blackform2") && entity.getHeldItem().name() == "fiskheroes:katana") {
        return "BLACKSAMURAI";
    }
        return null;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && !entity.getData("fiskheroes:blade");
    case "CHARGED_BEAM":
        return entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/devil_union");
    case "BLADE":
        return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/grimoire_timer") == 1 && !entity.getData("fiskheroes:shield");
    case "CHARGE_ICE":
        return entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/blackform2") || entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/devil_union");
    case "CHARGE_ENERGY":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 && entity.getData("fiskheroes:blade");
    case "DEMON_DESTROYER":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "BLACKFORM2":
        return !entity.isSneaking() && (entity.getData("fiskheroes:shield") || entity.getData("fiskheroes:blade") || entity.getHeldItem().name() == "fiskheroes:katana") || entity.getData("tmhp:dyn/blackform2");
    case "DEVILUNION":
        return entity.isSneaking() && (entity.getData("fiskheroes:shield") || entity.getData("fiskheroes:blade") || entity.getHeldItem().name() == "fiskheroes:katana") || entity.getData("tmhp:dyn/devil_union");
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:energy_manipulation":
        return modifier.id() == "blackslash" == (!entity.getData("tmhp:dyn/devil_union"));
    case "fiskheroes:energy_manipulation":
        return modifier.id() == "blackslash_du" == (entity.getData("tmhp:dyn/devil_union"));
    case "fiskheroes:potion_immunity":
        return modifier.id() == "fate_release" == (entity.getData("fiskheroes:dyn/steeled"));
    case "fiskheroes:controlled_flight":
        return entity.getData("tmhp:dyn/blackform2") || entity.getData("tmhp:dyn/devil_union");
    case "fiskheroes:cryo_charge":
        return entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/blackform2") || entity.getData("fiskheroes:shield") &&  entity.getData("tmhp:dyn/devil_union");
    default:
        return true;
    }
}
function getTierOverride(entity) {
   if (entity.getData("tmhp:dyn/devil_union")) {
        return 9;
    }
    return entity.getData("tmhp:dyn/blackform2") ? 7 : 5;
}