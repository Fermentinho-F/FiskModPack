function init(hero) {
    hero.addKeyBind("AIM", "key.shoot", 1);

    hero.setKeyBindEnabled((entity, keyBind) => canAim(entity));
    hero.setHasProperty((entity, property) => property == "MASK_TOGGLE");
    hero.supplyFunction("canAim", canAim);

    hero.setDamageProfile(entity => entity.getHeldItem().isEmpty() ? "FLAME_PUNCH" : null);
    hero.addDamageProfile("FLAME_PUNCH", {
        "types": {
            "BLUNT": 1.0,
            "FIRE": 0.4
        },
        "properties": {
            "HEAT_TRANSFER": 40,
            "IGNITE": 2
        }
    });

    hero.addSoundEvent("MASK_OPEN", "fiskheroes:flame_off");
    hero.addSoundEvent("MASK_CLOSE", "fiskheroes:flame_on");
}

function canAim(entity) {
    return entity.getHeldItem().isEmpty();
}