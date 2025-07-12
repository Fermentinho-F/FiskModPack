function init(hero) {
    hero.setName("Muciwara/\u00A7d\u00A7lAP 10");
    hero.setVersion("Issekai'd to Black Clover");
    hero.setTier(10);
    hero.hide();
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:katana", false, item => !item.nbt().getBoolean("Dual"));
    
    hero.addPowers("tmhp:hellfire_magic", "tmhp:devil_union");
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.5, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.8, 1);
    hero.addAttribute("WEAPON_DAMAGE", 8.5, 0);

    hero.addKeyBind("SHIELD", "Hellfang", 1);
    hero.addKeyBind("TELEPORT", "Hell Gate", 2);
    hero.addKeyBind("SPELL_MENU", "Spear", 2);
    hero.addKeyBind("CHARGE_ICE", "Hellball", 3);
    hero.addKeyBind("CHARGED_BEAM", "Hell Leak", 3);
    hero.addKeyBind("DEVILUNION2", "Toggle Devil Union", 4);
    hero.addKeyBind("OPEN_GRIMOIRE", "Open/Close Grimoire", 5);

    hero.setTierOverride(getTierOverride);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.addAttributeProfile("SHIELD", shieldProfile);
    hero.addAttributeProfile("UNIONSHIELD", unionshieldProfile);
    hero.addAttributeProfile("UNION", unionProfile);
    hero.setAttributeProfile(getProfile);
    hero.setTickHandler((entity, manager) => {

    if (entity.getData("fiskheroes:teleport_timer")) {
        manager.setData(entity, "fiskheroes:heat_vision", true);
    }
    });
}
function shieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 20.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.6, 1);
    profile.addAttribute("JUMP_HEIGHT", 0.5, 0);
    profile.addAttribute("REACH_DISTANCE", 5.0, 0);
}
function unionshieldProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 60.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 50.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("REACH_DISTANCE", 5.0, 0);
    profile.addAttribute("MAX_HEALTH", 20.0, 0);
}
function unionProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("IMPACT_DAMAGE", 3.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.8, 1);
    profile.addAttribute("MAX_HEALTH", 20.0, 0);
    profile.addAttribute("WEAPON_DAMAGE", 45.0, 0);
}
function getProfile(entity) {
    if (!entity.getData("tmhp:dyn/devil_union2") && entity.getData("fiskheroes:shield")) {
        return "SHIELD";
    }
    else if (entity.getData("tmhp:dyn/devil_union2") && entity.getData("fiskheroes:shield")) {
        return "UNIONSHIELD";
    }
    else if (entity.getData("tmhp:dyn/devil_union2") && !entity.getData("fiskheroes:shield")) {
        return "UNION";
    }
        return null;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/grimoire_timer") == 1 && !entity.getData("fiskheroes:cryo_charge") > 0;
    case "CHARGE_ICE":
        return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/grimoire_timer") == 1 && !entity.getData("fiskheroes:shield");
    case "SPELL_MENU":
        return entity.getHeldItem().isEmpty() && entity.getData("tmhp:dyn/grimoire_timer") == 1 && !entity.getData("fiskheroes:shield");
    case "DEVILUNION2":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1;
    case "TELEPORT":
        return entity.getData("tmhp:dyn/devil_union2") && entity.getHeldItem().name() == "fiskheroes:katana" || entity.getData("fiskheroes:shield") && entity.getData("tmhp:dyn/devil_union2");
    case "CHARGED_BEAM":
        return entity.getData("tmhp:dyn/devil_union2") && entity.getHeldItem().name() == "fiskheroes:katana" || entity.getData("tmhp:dyn/devil_union2") && entity.getData("fiskheroes:shield");
    default:
        return true;
    }
}
function getTierOverride(entity) {
    return entity.getData("tmhp:dyn/devil_union2") ? 10 : 1;
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return entity.getData("tmhp:dyn/devil_union2");
    case "fiskheroes:shield":
        return !entity.getData("fiskheroes:cryo_charge") > 0;
    case "fiskheroes:damage_bonus":
        return modifier.id() == "hellball" == (!entity.getData("tmhp:dyn/devil_union2"));
    case "fiskheroes:damage_bonus":
        return modifier.id() == "hellball_du" == (entity.getData("tmhp:dyn/devil_union2"));
    case "fiskheroes:regeneration":
        return modifier.id() == "base_reg" == (!entity.getData("tmhp:dyn/devil_union2"));
    case "fiskheroes:regeneration":
        return modifier.id() == "du_reg" == (entity.getData("tmhp:dyn/devil_union2"));
    case "fiskheroes:spellcasting":
        return modifier.id() == "base_spear" == (!entity.getData("tmhp:dyn/devil_union2"));
    case "fiskheroes:spellcasting":
        return modifier.id() == "du_spear" == (entity.getData("tmhp:dyn/devil_union2"));
    case "fiskheroes:cryo_charge":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:heat_vision":
        return entity.getData("fiskheroes:teleport_timer") > 0.9;
    default:
        return true;
    }
}