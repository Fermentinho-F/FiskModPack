var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var falcon_base = implement("fiskheroes:external/falcon_base");

function init(hero) {
    hero.setName("Lucifer Morningstar");
    hero.setTier(9);
    
    hero.setChestplate("suit");
    
    hero.addPowers("emo:devil");
    hero.addAttribute("PUNCH_DAMAGE", 16.0, 0);
    hero.addAttribute("KNOCKBACK", 6.5, 0);
    hero.addAttribute("SPRINT_SPEED", 0.7, 1);
    hero.addAttribute("JUMP_HEIGHT", 5.0, 0);
    hero.addAttribute("FALL_RESISTANCE", 10000000, 1);
    hero.addAttribute("MAX_HEALTH", 7.0, 0);
    hero.addAttribute("BASE_SPEED_LEVELS", 5.0, 0);
    
    hero.addKeyBind("AIM", "Hell Fire", 1);
    hero.addKeyBind("SPELL_MENU", "Devil Magic", 3);
    hero.addKeyBind("INVISIBILITY", "key.invisibility", 4);
    hero.addKeyBind("FACE", "Devil Face", 5);
    hero.addKeyBind("HEAT_VISION", "Devil Face", 5);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);
    hero.supplyFunction("canAim", canAim);

    super_boost = super_boost.create(200, 150, 20);
    falcon_base.init(hero, super_boost, 2, 0.25, (entity, manager) => {
        if (entity.getData("fiskheroes:shield")) {
            manager.setData(entity, "fiskheroes:flying", false);
        }
    });
}

function isModifierEnabled(entity, modifier) {
    switch (modifier.name()) {
    case "fiskheroes:controlled_flight":
        return (entity.getData("fiskheroes:flight_timer") > 0 || !entity.getData("fiskheroes:shield")) && super_boost.isModifierEnabled(entity, modifier);
    case "fiskheroes:shield":
        return !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    default:
        return true;
    }
}

function isKeyBindEnabled(entity, keyBind) {
    switch (keyBind) {
    case "SHIELD":
        return entity.getHeldItem().isEmpty() && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    default:
        return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}