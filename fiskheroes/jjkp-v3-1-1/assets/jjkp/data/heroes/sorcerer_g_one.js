var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Jujutsu Sorcerer/Grade 1");
    hero.setTier(4);

    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPrimaryEquipment("fiskheroes:scimitar", true);

    hero.addPowers("jjkp:cursed_energy");

    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.20, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);

    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 1);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
}

function isModifierEnabled(entity, modifier) {
    return entity.getHeldItem().isEmpty();
}

function isKeyBindEnabled(entity, keyBind) {
    return entity.getHeldItem().isEmpty();
}