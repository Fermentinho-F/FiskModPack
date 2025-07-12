var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Jujutsu Sorcerer/Grade 4");
    hero.setTier(1);

    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPrimaryEquipment("fiskheroes:compound_bow", true);
    hero.addEquipment("fiskheroes:quiver");

    hero.addPowers("jjkp:cursed_energy", "fiskheroes:archery");

    hero.addAttribute("PUNCH_DAMAGE", 4.5, 0);
    hero.addAttribute("WEAPON_DAMAGE", 5.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.05, 1);
    hero.addAttribute("JUMP_HEIGHT", 0.25, 0);
    hero.addAttribute("BOW_DRAWBACK", 0.25, 1);

    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 1);
    hero.addKeyBind("HORIZONTAL_BOW", "key.horizontalBow", 2);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
        case "fiskheroes:charge_energy":
            return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGE_ENERGY":
            return entity.getHeldItem().isEmpty();
    default:
        return true;
    }
}