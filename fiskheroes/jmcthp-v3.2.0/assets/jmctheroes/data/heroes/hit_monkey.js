//If you wasted time getting here, take sometime and go watch this beautiful show
function init(hero) {
    hero.setName("Monkey/Hit-Monkey");
    hero.setAliases("monkey", "coolderpz", "curiousderpz");
    hero.setTier(2);
    hero.addPrimaryEquipment("fiskheroes:katana", true, item => !item.nbt().getBoolean("Dual"));
    hero.addPrimaryEquipment("fiskheroes:desert_eagle{Dual:1}", true);
    
    hero.setHelmet("Head and Sunglasses");
    hero.setChestplate("Suit");
    hero.setLeggings("Pants");
    hero.setBoots("Feet");

    hero.addPowers("jmctheroes:hit_monkey");
    hero.addAttribute("FALL_RESISTANCE", 6.0, 0);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("PUNCH_DAMAGE", 5.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.4, 1);
    
    hero.addKeyBind("AIM", "key.aim", -1);
    hero.addKeyBind("GUN_RELOAD", "Reload Gun", 1);

    hero.setKeyBindEnabled((entity, keyBind) => keyBind != "GUN_RELOAD" || entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming"));
    hero.setHasPermission((entity, permission) => permission == "USE_GUN");
    hero.supplyFunction("canAim", entity => entity.getHeldItem().isGun());
    hero.setRuleValueModifier(rulez);
}

function rulez(entity, rule) {
    switch (rule.name()) {
        //Beretta 93R and Desert Eagle
    case "fiskheroes:recoil_beretta93r":
        return 0.25;
    case "fiskheroes:recoil_deserteagle":
        return 0.5;
    case "fiskheroes:spread_beretta93r":
        return 0.8;
    case "fiskheroes:spread_deserteagle":
        return 0.6;
    default:
        return rule.value();
    }
}
