function init(hero) {
    hero.setName("Steve");
    hero.setTier(4);
    hero.hide();

    hero.setHelmet("item.superhero_armor.piece.helmet");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("shadows:steve_power");

    hero.addKeyBindFunc("func_SLOT_CHANGING", slotChange, "Slot Change", 1);

    hero.addKeyBind("SLOT1", "Slot1", 4);
    hero.addKeyBind("SLOT2", "Slot2", 4);
    hero.addKeyBind("SLOT3", "Slot3", 4);
    hero.addKeyBind("SPELL_MENU", "Herobrine Transform", 4);

    hero.addKeyBind("TELEPORT", "Teleport", 5);
    hero.addKeyBind("TELEKINESIS", "Telekinesis", 3);

    hero.setHasProperty(hasProperty);

    hero.setModifierEnabled(isModifierEnabled);

    hero.setKeyBindEnabled(isKeyBindEnabled);

    hero.setTierOverride(getTierOverride);

    hero.addAttributeProfile("HEROBRINE", herobrineProfile);
    hero.setAttributeProfile(getProfile);

    hero.setTickHandler((entity, manager) => {
        if (entity.getData("fiskheroes:spellcast_timer") >= 0.5 && entity.getData("fiskheroes:spell_fraction") == 0 && entity.getData("shadows:dyn/1float_reset") == 1) {
            manager.setData(entity, "fiskheroes:dyn/steeled", !entity.getData("fiskheroes:dyn/steeled"));
        }
        if (entity.getData("shadows:dyn/1float_reset") != entity.getData("fiskheroes:spell_fraction")) {
            manager.setData(entity, "shadows:dyn/1float_reset", entity.getData("fiskheroes:spell_fraction"));
        }
        if (entity.getData("fiskheroes:spell_fraction") == 0 && entity.getData("fiskheroes:spellcast_timer") != 0) {
            manager.setData(entity, "fiskheroes:spellcast_timer", 0);
        }
    });

}

function slotChange(entity, manager) {
    var dataVar = "shadows:dyn/1integer_reset";
    var slot = entity.getData(dataVar);
    manager.setData(entity, dataVar, slot == 6 ? 0 : slot + 1);
    return true;
}

function isModifierEnabled(entity, modifier) {
    return modifier.name() == "fiskheroes:transformation" || modifier.name() == "fiskheroes:spellcasting" || modifier.name() == "fiskheroes:cooldown" || entity.getData("fiskheroes:dyn/steeled");
}

function isKeyBindEnabled(entity, keyBind) {
    var key = [keyBind == "TELEKINESIS", keyBind == "TELEPORT"];
    var slot = entity.getData("shadows:dyn/1integer_reset");
    if (entity.getData("fiskheroes:dyn/steeled") && keyBind != "SPELL_MENU" && !key[0] && !key[1] || !entity.getData("fiskheroes:dyn/steeled") && (key[0] || key[1])) {
        return false;
    }
    switch (keyBind) {
    case "SLOT1":
        return slot == 0 || slot == 3;
    case "SLOT2":
        return slot == 1 || slot == 4;
    case "SLOT3":
        return slot == 2 || slot == 5;
    case "SPELL_MENU":
        return slot == 6 || entity.getData("fiskheroes:dyn/steeled");
    default:
        return true;
    }
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE" || property == "BREATHE_SPACE" && entity.getData("fiskheroes:dyn/steeled");
}

function getTierOverride(entity) {
    return entity.getData("fiskheroes:dyn/steeled") ? 10 : 4;
}

function herobrineProfile(profile) {
    profile.addAttribute("JUMP_HEIGHT", 4, 0);
    profile.addAttribute("BASE_SPEED", 2, 1);
    profile.addAttribute("FALL_RESISTANCE", 1, 1);
    profile.addAttribute("PUNCH_DAMAGE", 9, 0);
}

function getProfile(entity) {
    return entity.getData("fiskheroes:dyn/steeled") ? "HEROBRINE" : null;
}
