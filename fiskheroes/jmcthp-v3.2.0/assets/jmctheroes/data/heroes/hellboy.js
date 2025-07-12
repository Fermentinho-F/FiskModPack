function init(hero) {
    hero.setName("Hellboy");
    hero.setVersion("item.superhero_armor.version.comics");
    hero.setAliases("Hell", "Doom");
    hero.setTier(8);
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jmctheroes:goodsamaritan, display:{Lore:[\"\u00A75\u00A7lJMCT Heroes\u00A7r\"]}}", true, item => item.nbt().getString("WeaponType") == "jmctheroes:goodsamaritan");
    hero.addPrimaryEquipment("fisktag:weapon{WeaponType:jmctheroes:excalibur, display:{Lore:[\"\u00A75\u00A7lJMCT Heroes\u00A7r\"]}, AttributeModifiers:[{Operation:0,UUIDLeast:1,UUIDMost:1,Amount:9.5,AttributeName:generic.attackDamage,Name:Sword}]}", true, item => item.nbt().getString("WeaponType") == "jmctheroes:excalibur");
    
    hero.setHelmet("item.superhero_armor.piece.head");
    hero.setChestplate("item.superhero_armor.piece.chestpiece");
    hero.setLeggings("item.superhero_armor.piece.pants");
    hero.setBoots("item.superhero_armor.piece.boots");

    hero.addPowers("jmctheroes:demon_physiology");
    hero.addAttribute("PUNCH_DAMAGE", 9.1, 0);
    hero.addAttribute("SPRINT_SPEED", 0.35, 1);
    hero.addAttribute("JUMP_HEIGHT", 2.25, 0);
    hero.addAttribute("WEAPON_DAMAGE", 0.2, 1);
    hero.addAttribute("FALL_RESISTANCE", 0.6, 1);

    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("EARTHQUAKE", "key.earthquake", 1);

    hero.setDefaultScale(1.1);
    hero.setHasPermission(hasPermission);
    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setDamageProfile(entity => entity.getHeldItem().isEmpty() ? "FLAME_PUNCH" : null);
    hero.addDamageProfile("FLAME_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 0.7
        },
        "properties": {
            "HEAT_TRANSFER": 60,
            "IGNITE": 4
        }
    });

}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "EARTHQUAKE":
        return !entity.isSprinting() && entity.isOnGround() && !entity.isSneaking();
    default:
        return true;
    }
}
function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:earthquake":
        return !entity.isSprinting() && entity.isOnGround() && !entity.isSneaking();
    default:
        return true;
    }
}
function hasPermission(entity, permission) {
    return permission == "USE_REVOLVER" || "USE_EXCALIBUR" ;
}

function canAim(entity) {
    return entity.getHeldItem().name() == "fisktag:weapon" && entity.getHeldItem().nbt().getString("WeaponType") == 'jmctheroes:goodsamaritan';
}
