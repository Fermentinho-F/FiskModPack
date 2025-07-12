var super_boost = implement("fiskheroes:external/super_boost_with_cooldown");
var falcon_base = implement("fiskheroes:external/falcon_base");

function init(hero) {
    hero.setName("Nature DNA");
    hero.setTier(1);

    hero.setChestplate("Syringe");

    hero.addPowers("moopack:nature_dna");

    hero.addKeyBind("GRAVITY_MANIPULATION", "Gravity Manipulation", 1);

    hero.setModifierEnabled(isModifierEnabled);
    hero.setKeyBindEnabled(isKeyBindEnabled);

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
    case "GUN_RELOAD":
        return entity.getHeldItem().isGun() && !entity.getData("fiskheroes:aiming") && !(entity.isSprinting() && entity.getData("fiskheroes:flying"));
    default:
        return super_boost.isKeyBindEnabled(entity, keyBind);
    }
}
