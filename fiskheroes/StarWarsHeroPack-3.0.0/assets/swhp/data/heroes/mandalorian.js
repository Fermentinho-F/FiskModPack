function init(hero) {
    hero.setName("The Mandalorian");
    hero.setAliases("Bounty_Hunter");
    hero.setTier(5);
    
    hero.setHelmet("Helmet");
    hero.setChestplate("Chestplate");
    hero.setLeggings("Leggings");
    hero.setBoots("Boots");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:ambanphasepulseblaster", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:ambanphasepulseblaster");
    hero.addPrimaryEquipment('fisktag:weapon{WeaponType:"swhp:ib94", display:{Lore:["\u00A76\u00A7lStar Wars\u00A7r"]}}', true, item => item.nbt().getString("WeaponType") == "swhp:ib94");
    
    hero.addPowers("swhp:mandalorian_armor", "swhp:grogu");
    hero.addAttribute("PUNCH_DAMAGE", 3.0, 0);
    hero.addAttribute("KNOCKBACK", 1.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.1, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.2, 1);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("TENTACLES", "Summon Grogu", 1);
    hero.addKeyBind("WEB_ZIP", "Wrist Grapple", 3);
    hero.addKeyBind("CHARGED_BEAM", "FlameThrower", 4);
    hero.addKeyBind("UTILITY_BELT", "Gadgets", 5);
    
    hero.setDefaultScale(1.0);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);
    hero.setHasProperty(hasProperty);
    hero.setHasPermission(hasPermission);

    hero.addSoundEvent("MASK_OPEN", "swhp:voicelines_mandalorian");
}

function hasProperty(entity, property) {
    return property == "MASK_TOGGLE";
}

function canAim(entity) {
    return (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:ambanphasepulseblaster") || (entity.getHeldItem().nbt().getString("WeaponType") == "swhp:ib94");
}

function hasPermission(entity, permission) {
    return (permission == "USE_AMBANPHASE") || (permission == "USE_IB94");
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:web_zip":
        return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "WEB_ZIP":
            return entity.getHeldItem().isEmpty();
        case "TENTACLES":
            return entity.isSneaking();
        default:
            return true;
    }
}