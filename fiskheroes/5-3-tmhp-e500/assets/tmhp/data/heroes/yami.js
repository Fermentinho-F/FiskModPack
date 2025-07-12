var black_blade = implement("tmhp:external/hellfire_katana");
function init(hero) {
    hero.setName("Yami Sukehiro/\u00A7c\u00A7lAP 8");
    hero.setVersion("Black Clover:Elf Arc");
    hero.setTier(8);
    
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");
    hero.addPrimaryEquipment("fiskheroes:katana", true, item => !item.nbt().getBoolean("Dual"));
    
    hero.addPowers("tmhp:yami_mahou");
    
    hero.addAttribute("FALL_RESISTANCE", 15.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 0.7, 0);
    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 8.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.6, 1);

    hero.addKeyBind("BLACKBLADE", "Toggle Black Blade", 1);
    hero.addKeyBind("CHARGE_ENERGY", "Dark Cloaked Avidya Slash", 2);
    hero.addKeyBind("CHARGED_BEAM", "Dark Cloaked Dimension Slash (Equinox when Sneaking)", 3);
    hero.addKeyBind("OPEN_GRIMOIRE", "Open/Close Grimoire", 5);

    hero.addAttributeProfile("BLACKBLADE", blackbladeProfile);
    hero.addAttributeProfile("STOP", stopProfile);
    hero.setAttributeProfile(getAttributeProfile);
    hero.setDamageProfile(getAttributeProfile);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setTickHandler((entity, manager) => {
        black_blade.hellfire_katana(entity, manager);
    });
    hero.addDamageProfile("BLACKBLADE", {
        "types": {
            "MAGIC": 1.0
        }
    });
}
function stopProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("SPRINT_SPEED", -1.0, 1);
    profile.addAttribute("BASE_SPEED", -1.0, 1);
    profile.addAttribute("JUMP_HEIGHT", -1.0, 1);
}
function blackbladeProfile(profile) {
    profile.inheritDefaults();
    profile.addAttribute("WEAPON_DAMAGE", 25.0, 0);
    profile.addAttribute("REACH_DISTANCE", 7.0, 0);
}
function getAttributeProfile(entity) {
    if (entity.getData("fiskheroes:beam_charge")) {
        return "STOP";
    }
    else if (entity.getData("tmhp:dyn/electrical")) {
        return "BLACKBLADE";
    }
    return true;
}
function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "BLACKBLADE":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 && entity.getHeldItem().name() == "fiskheroes:katana";
    case "CHARGE_ENERGY":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 && entity.getHeldItem().name() == "fiskheroes:katana" && !entity.getData("tmhp:dyn/electrical_timer");
    case "CHARGED_BEAM":
        return entity.getData("tmhp:dyn/grimoire_timer") == 1 && entity.getHeldItem().name() == "fiskheroes:katana";
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:charged_beam":
        return modifier.id() == "dimension_slash" == (!entity.isSneaking());
    case "fiskheroes:charged_beam":
        return modifier.id() == "dimension_slash_equinox" == (entity.isSneaking());
    default:
        return true;
    }
}