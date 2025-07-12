function createSpeedPunch(hero, damageProfile) {
    if (typeof damageProfile === "undefined") {
        damageProfile = {
            "types": {
                "BLUNT": 1.0
            },
            "properties": {
                "HIT_COOLDOWN": 7
            }
        };
    }

    hero.addDamageProfile("SPEED_PUNCH", damageProfile);
    return {
        get: (entity, orElse) => entity.getHeldItem().isEmpty() ? "SPEED_PUNCH" : orElse
    };
}
