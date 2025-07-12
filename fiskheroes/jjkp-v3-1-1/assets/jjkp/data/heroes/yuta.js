var utils = implement("fiskheroes:external/utils");

function init(hero) {
    hero.setName("Yuta Okkotsu");
    hero.setTier(5);

    hero.setHelmet("Face");
    hero.setChestplate("Shirt");
    hero.setLeggings("Pants");
    hero.setBoots("Shoes");

    hero.addPrimaryEquipment("fiskheroes:katana{display:{Name:\"Yuta's Katana\"}}", true);

    hero.addPowers("jjkp:rika", "jjkp:cursed_speech", "jjkp:cursed_energy");

    hero.addAttribute("PUNCH_DAMAGE", 6.0, 0);
    hero.addAttribute("WEAPON_DAMAGE", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.20, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);

    hero.addKeyBind("SONIC_WAVES", "Cursed Speech", 1);
    hero.addKeyBind("CHARGE_ENERGY", "Infuse Cursed Energy", 2);
    hero.addKeyBind("TENTACLE_JAB", "Rika Slash", 3);
    hero.addKeyBind("TENTACLE_GRAB", "Rika Grab", 4);
    hero.addKeyBind("TENTACLES", "Summon Rika", 5);

    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
}
/*
function isModifierEnabled(entity, modifier) {
    return entity.getHeldItem().isEmpty();
}*/

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:damage_weakness":
        return entity.getData('fiskheroes:tentacles') != null;
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
        case "CHARGE_ENERGY":
            return entity.getHeldItem().name() == "fiskheroes:katana";
        case "TENTACLE_JAB":
            return entity.getData('fiskheroes:tentacles') != null;
        case "TENTACLE_GRAB":
            return entity.getData('fiskheroes:tentacles') != null;
        case "SONIC_WAVES":
            return entity.getData("fiskheroes:sonic_waves") || entity.getData("jjkp:dyn/reverse_cooldown") == 0;
        default:
            return true;
        }
}