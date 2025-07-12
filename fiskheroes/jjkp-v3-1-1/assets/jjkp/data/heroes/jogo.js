var utils = implement("fiskheroes:external/utils");
var dome = implement("jjkp:external/domain");

function init(hero) {
    hero.setName("Jogo");
    hero.setTier(6);

    hero.setHelmet("Head");
    hero.setChestplate("Cloak");
    hero.setLeggings("Pants");
    hero.setBoots("Boots");

    hero.addPowers("jjkp:cursed_energy", "jjkp:disaster_flames", "jjkp:curse_physiology", "jjkp:jogo_domain");

    hero.addAttribute("PUNCH_DAMAGE", 7.0, 0);
    hero.addAttribute("SPRINT_SPEED", 0.25, 1);
    hero.addAttribute("JUMP_HEIGHT", 1.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 0.25, 1);

    hero.addKeyBind("CHARGE_ENERGY", "Charge Cursed Energy", 1);
    hero.addKeyBind("AIM", "Flame Blast", 2);
    hero.addKeyBind("SHADOWDOME", "Coffin Of The Iron Mountain", 3);

    hero.supplyFunction("canAim", canAim);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.setModifierEnabled(isModifierEnabled);
    hero.setAttributeProfile(getProfile);
    hero.addAttributeProfile("DOMAIN", domainProfile);
    hero.setTierOverride(getTierOverride);

    hero.setTickHandler((entity, manager) => {
        if (entity.getWornChestplate()) {
        manager.setData(entity, "jjkp:dyn/reset", dome.isEntityInTheirOwnDome(entity));
        }
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:charge_energy":
        return entity.getHeldItem().isEmpty();
    case "fiskheroes:fireball":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 0;
    case "fiskheroes:flame_blast":
        return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 0;
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

function getTierOverride(entity) {
    return entity.getData("jjkp:dyn/reset") ? 7 : 6;
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty() && entity.getInterpolatedData('fiskheroes:energy_charge') == 0;
}

function domainProfile(profile) {
    //profile.inheritDefaults();
    profile.addAttribute("PUNCH_DAMAGE", 10.0, 0);
    profile.addAttribute("SPRINT_SPEED", 0.5, 1);
    profile.addAttribute("JUMP_HEIGHT", 2.0, 0);
    profile.addAttribute("FALL_RESISTANCE", 0.25, 1);
}

function getProfile(entity) {
    if (entity.getData("jjkp:dyn/reset")) {
        return "DOMAIN";
    }
}